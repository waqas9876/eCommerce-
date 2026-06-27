from datetime import datetime, timedelta
import secrets
from extensions import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(120), nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password_h = db.Column(db.String(256), nullable=False)
    role       = db.Column(db.String(20), default='customer')  # customer | seller | admin
    store_name = db.Column(db.String(120))
    phone      = db.Column(db.String(30))
    whatsapp   = db.Column(db.String(30))
    is_active  = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade='all,delete-orphan')
    orders     = db.relationship('Order', backref='customer', lazy=True, foreign_keys='Order.customer_id')
    products   = db.relationship('Product', backref='seller', lazy=True)

    def set_password(self, pw):
        self.password_h = bcrypt.generate_password_hash(pw).decode('utf-8')

    def check_password(self, pw):
        return bcrypt.check_password_hash(self.password_h, pw)

    @property
    def initials(self):
        parts = self.name.split()
        return (parts[0][0] + (parts[1][0] if len(parts) > 1 else '')).upper()

    def to_dict(self):
        return {
            'id':         self.id,
            'name':       self.name,
            'email':      self.email,
            'role':       self.role,
            'store_name': self.store_name,
            'phone':      self.phone,
            'whatsapp':   self.whatsapp,
            'initials':   self.initials,
            'is_active':  self.is_active,
            'created_at': self.created_at.isoformat(),
        }


class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token      = db.Column(db.String(64), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used       = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def generate(user_id):
        # Invalidate old tokens for this user
        PasswordResetToken.query.filter_by(user_id=user_id, used=False).update({'used': True})
        t = PasswordResetToken(
            user_id=user_id,
            token=secrets.token_urlsafe(32),
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        db.session.add(t)
        db.session.commit()
        return t


class Product(db.Model):
    __tablename__ = 'products'
    id             = db.Column(db.Integer, primary_key=True)
    name           = db.Column(db.String(200), nullable=False)
    title          = db.Column(db.String(300))
    description    = db.Column(db.Text)
    price          = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float)
    discount       = db.Column(db.Integer, default=0)
    category       = db.Column(db.String(60))
    subcategory    = db.Column(db.String(60))
    brand          = db.Column(db.String(100))
    sku            = db.Column(db.String(80))
    color          = db.Column(db.String(40))
    stock          = db.Column(db.Integer, default=0)
    sold           = db.Column(db.Integer, default=0)
    rating         = db.Column(db.Float, default=0.0)
    review_count   = db.Column(db.Integer, default=0)
    images         = db.Column(db.JSON)               # list of URL strings
    badge_label    = db.Column(db.String(20))
    badge_cls      = db.Column(db.String(30))
    seller_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_approved    = db.Column(db.Boolean, default=True)
    is_active      = db.Column(db.Boolean, default=True)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)

    order_items    = db.relationship('OrderItem', backref='product', lazy=True)

    def to_dict(self, seller_name=None):
        s = self.seller  # joined User row
        _imgs = self.images or []
        return {
            # ── canonical fields ─────────────────────────────
            'id':             self.id,
            'name':           self.name,
            'title':          self.title or self.name,
            'description':    self.description,
            'price':          self.price,
            'original_price': self.original_price,
            'discount':       self.discount or 0,
            'category':       self.category,
            'subcategory':    self.subcategory,
            'brand':          self.brand or '',
            'sku':            self.sku or '',
            'color':          self.color or 'N/A',
            'stock':          self.stock,
            'sold':           self.sold,
            'rating':         self.rating,
            'review_count':   self.review_count,
            'images':         _imgs,
            'badge_label':    self.badge_label,
            'badge_cls':      self.badge_cls,
            'seller_id':      self.seller_id,
            'seller_name':    seller_name or (s.store_name or s.name if s else ''),
            'seller_email':   s.email      if s else '',
            'seller_phone':   s.phone      if s else '',
            'seller_wa':      s.whatsapp   if s else '',
            'is_approved':    self.is_approved,
            'is_active':      self.is_active,
            'created_at':     self.created_at.isoformat(),
            # ── frontend aliases (used directly by JS) ────────
            'imgs':        _imgs,
            'desc':        self.description or '',
            'subcat':      self.subcategory or self.category or '',
            'original':    self.original_price,
            'reviews':     self.review_count,
            'badgeLabel':  self.badge_label,
            'badgeCls':    self.badge_cls,
            'seller':      seller_name or (s.store_name or s.name if s else 'EcomX Store'),
            'sellerEmail': s.email    if s else '',
            'sellerPhone': s.phone    if s else '',
            'sellerWA':    s.whatsapp if s else '',
        }


class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity   = db.Column(db.Integer, default=1)

    product = db.relationship('Product', lazy=True)

    def to_dict(self):
        p = self.product
        return {
            'id':           self.id,
            'product_id':   self.product_id,
            'name':         p.name if p else '',
            'price':        p.price if p else 0,
            'image':        (p.images[0] if p and p.images else ''),
            'quantity':     self.quantity,
            'line_total':   round((p.price if p else 0) * self.quantity, 2),
        }


class Order(db.Model):
    __tablename__ = 'orders'
    id               = db.Column(db.Integer, primary_key=True)
    customer_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status           = db.Column(db.String(30), default='pending')
    # pending → processing → shipped → delivered | cancelled
    subtotal         = db.Column(db.Float, default=0)
    tax              = db.Column(db.Float, default=0)
    discount_amount  = db.Column(db.Float, default=0)
    total            = db.Column(db.Float, nullable=False)
    shipping_address = db.Column(db.JSON)
    coupon_code      = db.Column(db.String(30))
    created_at       = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at       = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all,delete-orphan')

    @property
    def order_number(self):
        return f'ECX-{self.id:05d}'

    def to_dict(self, include_items=True):
        d = {
            'id':               self.id,
            'order_number':     self.order_number,
            'status':           self.status,
            'subtotal':         self.subtotal,
            'tax':              self.tax,
            'discount_amount':  self.discount_amount,
            'total':            self.total,
            'coupon_code':      self.coupon_code,
            'shipping_address': self.shipping_address,
            'created_at':       self.created_at.isoformat(),
            'updated_at':       self.updated_at.isoformat() if self.updated_at else None,
            'customer_name':    self.customer.name if self.customer else '',
        }
        if include_items:
            d['items'] = [i.to_dict() for i in self.items]
        return d


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id           = db.Column(db.Integer, primary_key=True)
    order_id     = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id   = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_name = db.Column(db.String(200))
    quantity     = db.Column(db.Integer, nullable=False)
    price        = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id':           self.id,
            'product_id':   self.product_id,
            'product_name': self.product_name,
            'quantity':     self.quantity,
            'price':        self.price,
            'line_total':   round(self.price * self.quantity, 2),
        }
