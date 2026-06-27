from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models import User, Product, OrderItem

products_bp = Blueprint('products', __name__)


def _current_user():
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return User.query.get(int(uid)) if uid else None
    except Exception:
        return None


@products_bp.get('/')
def list_products():
    q = Product.query.filter_by(is_active=True, is_approved=True)

    cat = request.args.get('cat', '').lower()
    if cat:
        CAT_MAP = {
            'electronics': 'Electronics', 'fashion': 'Fashion',
            'home': 'Home & Garden', 'beauty': 'Beauty',
            'sports': 'Sports', 'toys': 'Toys & Kids',
        }
        q = q.filter(Product.category == CAT_MAP.get(cat, cat.title()))

    search = request.args.get('search', '').strip()
    if search:
        like = f'%{search}%'
        q = q.filter(
            db.or_(Product.name.ilike(like), Product.category.ilike(like), Product.brand.ilike(like))
        )

    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    min_rating = request.args.get('min_rating', type=float)
    if min_rating:
        q = q.filter(Product.rating >= min_rating)

    in_stock = request.args.get('in_stock')
    if in_stock == '1':
        q = q.filter(Product.stock > 0)

    on_sale = request.args.get('on_sale')
    if on_sale == '1':
        q = q.filter(Product.discount > 0)

    sort = request.args.get('sort', 'default')
    if sort == 'price_asc':
        q = q.order_by(Product.price.asc())
    elif sort == 'price_desc':
        q = q.order_by(Product.price.desc())
    elif sort == 'rating':
        q = q.order_by(Product.rating.desc())
    elif sort == 'popular':
        q = q.order_by(Product.sold.desc())
    else:
        q = q.order_by(Product.id.asc())

    products = q.all()
    return jsonify(products=[p.to_dict() for p in products], total=len(products)), 200


@products_bp.get('/<int:pid>')
def get_product(pid):
    p = db.get_or_404(Product, pid)
    return jsonify(product=p.to_dict()), 200


@products_bp.get('/my')
@jwt_required()
def my_products():
    uid = int(get_jwt_identity())
    u   = db.get_or_404(User, uid)
    if u.role not in ('seller', 'admin'):
        return jsonify(error='Seller access required.'), 403
    q = Product.query.filter_by(seller_id=uid, is_active=True) if u.role == 'seller' else Product.query.filter_by(is_active=True)
    products = q.order_by(Product.created_at.desc()).all()
    return jsonify(products=[p.to_dict() for p in products]), 200


@products_bp.post('/')
@jwt_required()
def create_product():
    uid  = int(get_jwt_identity())
    u    = db.get_or_404(User, uid)
    if u.role not in ('seller', 'admin'):
        return jsonify(error='Seller access required.'), 403

    data = request.get_json() or {}
    required = ('name', 'price', 'category')
    for f in required:
        if not data.get(f):
            return jsonify(error=f'Field "{f}" is required.'), 400

    # Accept both backend snake_case and frontend camelCase/short aliases
    imgs     = data.get('images') or data.get('imgs') or []
    orig     = data.get('original_price') or data.get('original')
    discount = data.get('discount', 0)
    if orig and not discount:
        discount = max(0, round((1 - float(data['price']) / float(orig)) * 100))

    p = Product(
        name=data['name'],
        title=data.get('title') or data['name'],
        description=data.get('description') or data.get('desc', ''),
        price=float(data['price']),
        original_price=float(orig) if orig else None,
        discount=discount,
        category=data['category'],
        subcategory=data.get('subcategory') or data.get('subcat', ''),
        brand=data.get('brand', ''),
        sku=data.get('sku', ''),
        color=data.get('color', 'N/A'),
        stock=int(data.get('stock', 0)),
        images=imgs,
        badge_label=data.get('badge_label') or data.get('badgeLabel'),
        badge_cls=data.get('badge_cls')   or data.get('badgeCls'),
        seller_id=uid,
        is_approved=True,   # auto-approve all seller listings
    )
    db.session.add(p)
    db.session.commit()
    return jsonify(product=p.to_dict(), message='Product created.'), 201


@products_bp.put('/<int:pid>')
@jwt_required()
def update_product(pid):
    uid = int(get_jwt_identity())
    u   = db.get_or_404(User, uid)
    p   = db.get_or_404(Product, pid)

    if u.role not in ('admin',) and p.seller_id != uid:
        return jsonify(error='Access denied.'), 403

    data = request.get_json() or {}
    alias = {
        'desc': 'description', 'subcat': 'subcategory',
        'original': 'original_price', 'imgs': 'images',
        'badgeLabel': 'badge_label', 'badgeCls': 'badge_cls',
    }
    for src, dst in alias.items():
        if src in data and dst not in data:
            data[dst] = data[src]
    for field in ('name','title','description','price','original_price','discount',
                  'category','subcategory','brand','sku','color','stock','images',
                  'badge_label','badge_cls','is_active'):
        if field in data:
            setattr(p, field, data[field])
    if 'is_approved' in data and u.role == 'admin':
        p.is_approved = data['is_approved']

    db.session.commit()
    return jsonify(product=p.to_dict(), message='Product updated.'), 200


@products_bp.delete('/<int:pid>')
@jwt_required()
def delete_product(pid):
    uid = int(get_jwt_identity())
    u   = db.get_or_404(User, uid)
    p   = db.get_or_404(Product, pid)

    if u.role != 'admin' and p.seller_id != uid:
        return jsonify(error='Access denied.'), 403

    if u.role == 'admin':
        # Hard delete — nullify FK references first to avoid constraint error
        OrderItem.query.filter_by(product_id=pid).update({'product_id': None})
        db.session.delete(p)
    else:
        p.is_active = False
    db.session.commit()
    return jsonify(message='Product removed.'), 200
