from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from extensions import db
from models import User, PasswordResetToken

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


@auth_bp.post('/forgot-password')
def forgot_password():
    email = (request.get_json() or {}).get('email', '').strip().lower()
    if not email:
        return jsonify(error='Email is required.'), 400
    u = User.query.filter_by(email=email).first()
    # Always return success to prevent email enumeration
    if not u:
        return jsonify(message='If that email exists, a reset link has been generated.'), 200
    t = PasswordResetToken.generate(u.id)
    # Return token in response (demo/localhost mode — in production send via email)
    return jsonify(
        message='Password reset link generated.',
        reset_token=t.token,
        # Frontend builds the full URL using this token
    ), 200


@auth_bp.post('/reset-password')
def reset_password():
    data     = request.get_json() or {}
    token    = (data.get('token') or '').strip()
    new_pw   = data.get('password') or ''
    if not token or not new_pw:
        return jsonify(error='Token and new password are required.'), 400
    if len(new_pw) < 6:
        return jsonify(error='Password must be at least 6 characters.'), 400

    t = PasswordResetToken.query.filter_by(token=token, used=False).first()
    if not t:
        return jsonify(error='Invalid or expired reset link.'), 400
    if datetime.utcnow() > t.expires_at:
        t.used = True
        db.session.commit()
        return jsonify(error='This reset link has expired. Please request a new one.'), 400

    u = User.query.get(t.user_id)
    if not u:
        return jsonify(error='User not found.'), 404

    u.set_password(new_pw)
    t.used = True
    db.session.commit()
    return jsonify(message='Password reset successfully. You can now log in.'), 200
