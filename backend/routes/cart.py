from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Product, CartItem

cart_bp = Blueprint('cart', __name__)


@cart_bp.get('/')
@jwt_required()
def get_cart():
    uid   = int(get_jwt_identity())
    items = CartItem.query.filter_by(user_id=uid).all()
    return jsonify(items=[i.to_dict() for i in items],
                   total=round(sum(i.to_dict()['line_total'] for i in items), 2)), 200


@cart_bp.post('/')
@jwt_required()
def add_to_cart():
    uid  = int(get_jwt_identity())
    data = request.get_json() or {}
    pid  = data.get('product_id')
    qty  = int(data.get('quantity', 1))

    p = Product.query.filter_by(id=pid, is_active=True).first()
    if not p:
        return jsonify(error='Product not found.'), 404
    if p.stock < qty:
        return jsonify(error='Insufficient stock.'), 400

    item = CartItem.query.filter_by(user_id=uid, product_id=pid).first()
    if item:
        item.quantity = min(item.quantity + qty, 99)
    else:
        item = CartItem(user_id=uid, product_id=pid, quantity=qty)
        db.session.add(item)

    db.session.commit()
    return jsonify(item=item.to_dict(), message=f'{p.name} added to cart.'), 200


@cart_bp.put('/<int:item_id>')
@jwt_required()
def update_cart(item_id):
    uid  = int(get_jwt_identity())
    item = CartItem.query.filter_by(id=item_id, user_id=uid).first_or_404()
    data = request.get_json() or {}
    qty  = int(data.get('quantity', item.quantity))

    if qty <= 0:
        db.session.delete(item)
        db.session.commit()
        return jsonify(message='Item removed.'), 200

    item.quantity = min(qty, 99)
    db.session.commit()
    return jsonify(item=item.to_dict()), 200


@cart_bp.delete('/<int:item_id>')
@jwt_required()
def remove_item(item_id):
    uid  = int(get_jwt_identity())
    item = CartItem.query.filter_by(id=item_id, user_id=uid).first_or_404()
    db.session.delete(item)
    db.session.commit()
    return jsonify(message='Item removed.'), 200


@cart_bp.delete('/')
@jwt_required()
def clear_cart():
    uid = int(get_jwt_identity())
    CartItem.query.filter_by(user_id=uid).delete()
    db.session.commit()
    return jsonify(message='Cart cleared.'), 200
