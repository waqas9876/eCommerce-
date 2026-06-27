from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Product, CartItem, Order, OrderItem

orders_bp = Blueprint('orders', __name__)

VALID_STATUSES = ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
COUPONS = {'SAVE10': 10, 'ECOMX20': 20, 'WELCOME5': 5}   # percentage discounts


@orders_bp.post('/')
@jwt_required()
def place_order():
    uid  = int(get_jwt_identity())
    u    = db.get_or_404(User, uid)
    data = request.get_json() or {}

    db_cart   = CartItem.query.filter_by(user_id=uid).all()
    req_items = data.get('items', [])

    order_lines = []   # (product_or_None, qty, name, unit_price)
    subtotal = 0.0

    if db_cart:
        for ci in db_cart:
            p = ci.product
            if not p or not p.is_active:
                return jsonify(error='A product in your cart is no longer available.'), 400
            if p.stock < ci.quantity:
                return jsonify(error=f'Insufficient stock for {p.name}.'), 400
            order_lines.append((p, ci.quantity, p.name, p.price))
            subtotal += p.price * ci.quantity
    elif req_items:
        for item in req_items:
            pid   = item.get('id') or item.get('product_id')
            qty   = max(1, int(item.get('qty') or item.get('quantity') or 1))
            name  = str(item.get('name', 'Product'))
            price = float(item.get('price', 0))
            p = Product.query.filter_by(id=pid, is_active=True).first() if pid else None
            if p:
                if p.stock < qty:
                    return jsonify(error=f'Insufficient stock for {p.name}.'), 400
                order_lines.append((p, qty, p.name, p.price))
                subtotal += p.price * qty
            else:
                order_lines.append((None, qty, name, price))
                subtotal += price * qty
    else:
        return jsonify(error='Your cart is empty.'), 400

    coupon_code = (data.get('coupon_code') or '').upper()
    coupon_pct  = COUPONS.get(coupon_code, 0)
    discount    = round(subtotal * coupon_pct / 100, 2) if coupon_pct else 0.0
    shipping_fee = float(data.get('shipping_fee', 0) or 0)
    tax          = round((subtotal - discount + shipping_fee) * 0.1, 2)
    total        = round(subtotal - discount + shipping_fee + tax, 2)

    order = Order(
        customer_id=uid,
        subtotal=round(subtotal, 2),
        tax=tax,
        discount_amount=discount,
        total=total,
        coupon_code=coupon_code or None,
        shipping_address=data.get('shipping_address'),
        status='processing',
    )
    db.session.add(order)
    db.session.flush()

    for p, qty, name, price in order_lines:
        db.session.add(OrderItem(
            order_id=order.id,
            product_id=p.id if p else None,
            product_name=name,
            quantity=qty,
            price=price,
        ))
        if p:
            p.stock = max(0, p.stock - qty)
            p.sold  += qty

    if db_cart:
        CartItem.query.filter_by(user_id=uid).delete()

    db.session.commit()
    return jsonify(order=order.to_dict(), message='Order placed successfully!'), 201


@orders_bp.get('/')
@jwt_required()
def list_orders():
    uid = int(get_jwt_identity())
    u   = db.get_or_404(User, uid)
    if u.role == 'customer':
        orders = Order.query.filter_by(customer_id=uid).order_by(Order.created_at.desc()).all()
    elif u.role == 'seller':
        seller_product_ids = [p.id for p in Product.query.filter_by(seller_id=uid).all()]
        order_ids = db.session.query(OrderItem.order_id)\
            .filter(OrderItem.product_id.in_(seller_product_ids)).distinct().all()
        order_ids = [r[0] for r in order_ids]
        orders = Order.query.filter(Order.id.in_(order_ids)).order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify(orders=[o.to_dict() for o in orders]), 200


@orders_bp.get('/<int:oid>')
@jwt_required()
def get_order(oid):
    uid = int(get_jwt_identity())
    u   = db.get_or_404(User, uid)
    o   = db.get_or_404(Order, oid)
    if u.role == 'customer' and o.customer_id != uid:
        return jsonify(error='Access denied.'), 403
    return jsonify(order=o.to_dict()), 200


@orders_bp.get('/track/<order_num>')
def track_order(order_num):
    """Public tracking — no auth required."""
    try:
        oid = int(order_num.upper().replace('ECX-', '').lstrip('0') or '0')
    except Exception:
        return jsonify(error='Invalid order number. Use format: ECX-00001'), 400
    o = Order.query.get(oid)
    if not o:
        return jsonify(error='Order not found. Please check your order number.'), 404
    return jsonify(order=o.to_dict(include_items=True)), 200


@orders_bp.put('/<int:oid>/status')
@jwt_required()
def update_status(oid):
    uid    = int(get_jwt_identity())
    u      = db.get_or_404(User, uid)
    o      = db.get_or_404(Order, oid)
    status = (request.get_json() or {}).get('status')
    if u.role == 'customer':
        return jsonify(error='Access denied.'), 403
    if status not in VALID_STATUSES:
        return jsonify(error=f'Status must be one of: {", ".join(VALID_STATUSES)}'), 400
    o.status = status
    db.session.commit()
    return jsonify(order=o.to_dict(), message='Status updated.'), 200
