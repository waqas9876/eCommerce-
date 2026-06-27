from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.post('/register')
def register():
    data = request.get_json() or {}
    name  = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    pw    = data.get('password') or ''
    role  = data.get('role', 'customer')

    if not name or not email or not pw:
        return jsonify(error='Name, email, and password are required.'), 400
    if role not in ('customer', 'seller'):
        role = 'customer'
    if User.query.filter_by(email=email).first():
        return jsonify(error='An account with this email already exists.'), 409

    u = User(
        name=name, email=email, role=role,
        store_name=data.get('store_name') or (name if role == 'seller' else None),
        phone=data.get('phone', ''),
        whatsapp=data.get('whatsapp', ''),
    )
    u.set_password(pw)
    db.session.add(u)
    db.session.commit()

    token = create_access_token(identity=str(u.id))
    return jsonify(token=token, user=u.to_dict()), 201


@auth_bp.post('/login')
def login():
    data  = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    pw    = data.get('password') or ''

    u = User.query.filter_by(email=email).first()
    if not u or not u.check_password(pw):
        return jsonify(error='Invalid email or password.'), 401
    if not u.is_active:
        return jsonify(error='This account has been suspended.'), 403

    token = create_access_token(identity=str(u.id))
    return jsonify(token=token, user=u.to_dict()), 200


@auth_bp.get('/me')
@jwt_required()
def me():
    uid = int(get_jwt_identity())
    u   = db.get_or_404(User, uid)
    return jsonify(user=u.to_dict()), 200


@auth_bp.put('/me')
@jwt_required()
def update_me():
    uid  = int(get_jwt_identity())
    u    = db.get_or_404(User, uid)
    data = request.get_json() or {}
    if 'name'       in data: u.name       = data['name'].strip() or u.name
    if 'phone'      in data: u.phone      = data['phone']
    if 'whatsapp'   in data: u.whatsapp   = data['whatsapp']
    if 'store_name' in data: u.store_name = data['store_name']
    db.session.commit()
    return jsonify(user=u.to_dict()), 200


@auth_bp.post('/logout')
def logout():
    return jsonify(message='Logged out.'), 200
