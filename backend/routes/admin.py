from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Product, Order, OrderItem, CartItem

admin_bp = Blueprint('admin', __name__)


def _require_admin():
    uid = int(get_jwt_identity())
    u   = User.query.get(uid)
    if not u or u.role != 'admin':
        return None, (jsonify(error='Admin access required.'), 403)
    return u, None


@admin_bp.get('/stats')
@jwt_required()
def stats():
    _, err = _require_admin()
    if err: return err

    total_users    = User.query.count()
    total_sellers  = User.query.filter_by(role='seller').count()
    total_customers= User.query.filter_by(role='customer').count()
    total_products = Product.query.filter_by(is_active=True).count()
    pending_products = Product.query.filter_by(is_active=True, is_approved=False).count()
    total_orders   = Order.query.count()
    revenue        = db.session.query(db.func.sum(Order.total)).scalar() or 0

    return jsonify(
        users=total_users, sellers=total_sellers, customers=total_customers,
        products=total_products, pending_products=pending_products,
        orders=total_orders, revenue=round(revenue, 2)
    ), 200


@admin_bp.get('/users')
@jwt_required()
def list_users():
    _, err = _require_admin()
    if err: return err

    role = request.args.get('role')
    q    = User.query if not role else User.query.filter_by(role=role)
    users = q.order_by(User.created_at.desc()).all()
    return jsonify(users=[u.to_dict() for u in users]), 200


@admin_bp.put('/users/<int:uid>')
@jwt_required()
def update_user(uid):
    _, err = _require_admin()
    if err: return err

    u    = db.get_or_404(User, uid)
    data = request.get_json() or {}
    if 'is_active' in data:
        u.is_active = bool(data['is_active'])
    if 'role' in data and data['role'] in ('customer', 'seller', 'admin'):
        u.role = data['role']
    db.session.commit()
    return jsonify(user=u.to_dict(), message='User updated.'), 200


@admin_bp.get('/products')
@jwt_required()
def list_products():
    _, err = _require_admin()
    if err: return err

    status = request.args.get('status', '')
    q = Product.query.filter_by(is_active=True)   # never show deleted products
    if status == 'pending':
        q = q.filter_by(is_approved=False)
    elif status == 'active':
        q = q.filter_by(is_approved=True)
    products = q.order_by(Product.created_at.desc()).all()
    return jsonify(products=[p.to_dict() for p in products]), 200


@admin_bp.put('/products/<int:pid>/approve')
@jwt_required()
def approve_product(pid):
    _, err = _require_admin()
    if err: return err

    p = db.get_or_404(Product, pid)
    data = request.get_json() or {}
    p.is_approved = bool(data.get('approved', True))
    db.session.commit()
    msg = 'Product approved.' if p.is_approved else 'Product rejected.'
    return jsonify(product=p.to_dict(), message=msg), 200


@admin_bp.get('/orders')
@jwt_required()
def list_orders():
    _, err = _require_admin()
    if err: return err

    status = request.args.get('status')
    q = Order.query if not status else Order.query.filter_by(status=status)
    orders = q.order_by(Order.created_at.desc()).all()
    return jsonify(orders=[o.to_dict(include_items=False) for o in orders]), 200


@admin_bp.put('/orders/<int:oid>/status')
@jwt_required()
def update_order_status(oid):
    _, err = _require_admin()
    if err: return err

    o      = db.get_or_404(Order, oid)
    status = (request.get_json() or {}).get('status')
    valid  = ('pending','processing','shipped','delivered','cancelled')
    if status not in valid:
        return jsonify(error=f'Status must be one of: {", ".join(valid)}'), 400
    o.status = status
    db.session.commit()
    return jsonify(order=o.to_dict(include_items=False), message='Status updated.'), 200


@admin_bp.get('/sellers/<int:uid>')
@jwt_required()
def seller_detail(uid):
    _, err = _require_admin()
    if err: return err
    u = db.get_or_404(User, uid)
    products = Product.query.filter_by(seller_id=uid).order_by(Product.created_at.desc()).all()
    product_ids = [p.id for p in products]
    order_items = OrderItem.query.filter(OrderItem.product_id.in_(product_ids)).all() if product_ids else []
    total_revenue = sum(oi.price * oi.quantity for oi in order_items)
    order_ids = list(set(oi.order_id for oi in order_items))
    orders = Order.query.filter(Order.id.in_(order_ids)).order_by(Order.created_at.desc()).all() if order_ids else []
    buyer_ids = list(set(o.customer_id for o in orders))
    return jsonify(
        user=u.to_dict(),
        products=[p.to_dict() for p in products],
        total_sold=sum(p.sold for p in products),
        total_listed=len(products),
        total_revenue=round(total_revenue, 2),
        total_orders=len(order_ids),
        total_buyers=len(buyer_ids),
        recent_orders=[o.to_dict(include_items=True) for o in orders[:10]]
    ), 200


@admin_bp.get('/buyers/<int:uid>')
@jwt_required()
def buyer_detail(uid):
    _, err = _require_admin()
    if err: return err
    u = db.get_or_404(User, uid)
    orders = Order.query.filter_by(customer_id=uid).order_by(Order.created_at.desc()).all()
    return jsonify(
        user=u.to_dict(),
        orders=[o.to_dict(include_items=True) for o in orders],
        total_orders=len(orders),
        total_spent=round(sum(o.total for o in orders), 2)
    ), 200
