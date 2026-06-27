"""Seed demo users and all 13 catalogue products."""
from extensions import db, bcrypt
from models import User, Product


DEMO_PRODUCTS = [
    dict(name='AirPods Pro', title='AirPods Pro — Active Noise Cancelling Wireless Earbuds',
         description='Experience immersive audio with industry-leading Active Noise Cancellation. Adaptive Transparency lets in outside noise when you need it.',
         price=199.99, original_price=249.99, discount=20, category='Electronics', subcategory='Headphones',
         brand='Apple', sku='APRD-AIRPODSPRO-WHT', color='White', stock=47, sold=2100, rating=4.5, review_count=248,
         badge_label='-20%', badge_cls='badge-sale',
         images=['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
                 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
         seller_email='seller@ecomx.com'),

    dict(name='Urban Runner Pro', title='Urban Runner Pro — Lightweight Athletic Sneakers',
         description='Built for speed and comfort with lightweight mesh upper and responsive cushioning.',
         price=89.99, original_price=None, discount=0, category='Fashion', subcategory='Footwear',
         brand='UrbanStep', sku='URB-RUNNER-PRO-42', color='Black', stock=35, sold=800, rating=5.0, review_count=112,
         badge_label='New', badge_cls='badge-new',
         images=['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
         seller_email='fashion@ecomx.com'),

    dict(name='FitPulse Smart Watch', title='FitPulse Smart Watch — Health & Fitness Tracker',
         description='Track your health 24/7 with heart rate monitoring, sleep tracking, SpO2, and built-in GPS.',
         price=149.00, original_price=179.00, discount=17, category='Electronics', subcategory='Wearables',
         brand='FitPulse', sku='FP-WATCH-001', color='Black', stock=22, sold=640, rating=4.0, review_count=89,
         badge_label='Hot', badge_cls='badge-hot',
         images=['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'],
         seller_email='seller@ecomx.com'),

    dict(name='Luxe Bloom Perfume', title='Luxe Bloom Perfume — Floral & Citrus Eau de Parfum 100ml',
         description='A sophisticated blend of jasmine, rose, and fresh citrus top notes. Long-lasting EDP.',
         price=59.99, original_price=74.99, discount=20, category='Beauty', subcategory='Fragrances',
         brand='Luxe Bloom', sku='LB-PERF-100ML', color='Original', stock=18, sold=420, rating=4.5, review_count=67,
         badge_label='-20%', badge_cls='badge-sale',
         images=['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop'],
         seller_email='beauty@ecomx.com'),

    dict(name='TechCarry Laptop Bag', title='TechCarry Pro — 15.6" Laptop Backpack with USB Charging Port',
         description='Designed for professionals. Padded 15.6" compartment, built-in USB port, anti-theft pocket.',
         price=45.00, original_price=None, discount=0, category='Fashion', subcategory='Bags & Backpacks',
         brand='TechCarry', sku='TC-BAG-156-GRY', color='Grey', stock=60, sold=280, rating=4.2, review_count=45,
         badge_label='New', badge_cls='badge-new',
         images=['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'],
         seller_email='fashion@ecomx.com'),

    dict(name='FlexFit Yoga Mat', title='FlexFit Yoga Mat — Extra Thick Non-Slip 6mm',
         description='Premium 6mm eco-friendly TPE mat. Excellent joint cushioning for yoga, pilates, and stretching.',
         price=29.99, original_price=39.99, discount=25, category='Sports', subcategory='Yoga & Pilates',
         brand='FlexFit', sku='FF-YOGA-MAT-6MM', color='Purple', stock=94, sold=1200, rating=4.7, review_count=188,
         badge_label='-25%', badge_cls='badge-sale',
         images=['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop'],
         seller_email='sports@ecomx.com'),

    dict(name='MechType Pro Keyboard', title='MechType Pro — RGB Mechanical Gaming Keyboard',
         description='Full mechanical switches with per-key RGB. Anodized aluminum frame, detachable USB-C cable.',
         price=79.99, original_price=99.99, discount=20, category='Electronics', subcategory='Keyboards',
         brand='MechType', sku='MECH-KB-RGB-001', color='Black', stock=33, sold=1850, rating=4.9, review_count=302,
         badge_label='-20%', badge_cls='badge-sale',
         images=['https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600&h=600&fit=crop'],
         seller_email='seller@ecomx.com'),

    dict(name='BrewMaster Coffee Machine', title='BrewMaster Pro — 15-Bar Espresso & Coffee Machine',
         description='Barista-quality espresso at home. 15-bar pump, steam wand, 1.5L tank, heats in 25 seconds.',
         price=119.00, original_price=149.00, discount=20, category='Home & Garden', subcategory='Kitchen Appliances',
         brand='BrewMaster', sku='BM-ESPRESSO-15B', color='Silver', stock=15, sold=720, rating=4.5, review_count=156,
         badge_label='Hot', badge_cls='badge-hot',
         images=['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop'],
         seller_email='home@ecomx.com'),

    dict(name='Vista Pro Sunglasses', title='Vista Pro — UV400 Polarized Sunglasses',
         description='UV400 polarized lenses blocking 100% UVA/UVB. Lightweight TR90 frame with hard case.',
         price=34.99, original_price=None, discount=0, category='Fashion', subcategory='Eyewear',
         brand='Vista', sku='VISTA-SG-UV400', color='Black', stock=55, sold=390, rating=4.0, review_count=74,
         badge_label='New', badge_cls='badge-new',
         images=['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop'],
         seller_email='fashion@ecomx.com'),

    dict(name='GlowUp Skincare Set', title='GlowUp Vitamin C Serum & Moisturizer Set',
         description='20% Vitamin C Brightening Serum + Niacinamide Moisturizer. Glass-skin glow in 4 weeks.',
         price=42.00, original_price=55.00, discount=24, category='Beauty', subcategory='Skincare',
         brand='GlowUp', sku='GLOWUP-VITC-SET', color='Original', stock=8, sold=1500, rating=5.0, review_count=203,
         badge_label='-24%', badge_cls='badge-sale',
         images=['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
         seller_email='beauty@ecomx.com'),

    dict(name='SoundWave Pro Speaker', title='SoundWave Pro — 30W Portable Bluetooth Speaker',
         description='30W dual-driver Bluetooth 5.3 with 360° surround sound. IPX7 waterproof, 24hr battery.',
         price=69.99, original_price=99.99, discount=30, category='Electronics', subcategory='Speakers',
         brand='SoundWave', sku='SW-SPK-30W-BLK', color='Black', stock=28, sold=860, rating=4.5, review_count=127,
         badge_label='-30%', badge_cls='badge-sale',
         images=['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'],
         seller_email='seller@ecomx.com'),

    dict(name='PowerLift Dumbbell Set', title='PowerLift — Adjustable Dumbbell Set 5–25kg',
         description='Replace 15 sets of weights with one compact pair. 5–25kg in 2.5kg increments.',
         price=89.00, original_price=None, discount=0, category='Sports', subcategory='Strength Training',
         brand='PowerLift', sku='PL-DUMBBELL-25KG', color='Black', stock=12, sold=540, rating=4.0, review_count=91,
         badge_label=None, badge_cls=None,
         images=['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'],
         seller_email='sports@ecomx.com'),

    dict(name='ArmorShield Pro Case', title='ArmorShield Pro — Military-Grade Drop Protection Phone Case',
         description='MIL-STD-810G drop protection. Wireless charging compatible, raised bezels, precise cutouts.',
         price=19.99, original_price=None, discount=0, category='Electronics', subcategory='Phone Accessories',
         brand='ArmorShield', sku='AS-CASE-002', color='Clear', stock=145, sold=2200, rating=4.3, review_count=158,
         badge_label=None, badge_cls=None,
         images=['https://images.unsplash.com/photo-1601593346740-925612772716?w=600&h=600&fit=crop'],
         seller_email='seller@ecomx.com'),
]


def seed():
    if User.query.count() > 0:
        return  # already seeded

    print('Seeding demo data...')

    demo_users = [
        ('Ahmed Siddiqui',  'customer@ecomx.com', 'customer', None),
        ('TechZone Store',  'seller@ecomx.com',   'seller',   'TechZone Official Store'),
        ('Super Admin',     'admin@ecomx.com',     'admin',    None),
        ('Fashion Hub',     'fashion@ecomx.com',   'seller',   'FashionHub'),
        ('Beauty Glow',     'beauty@ecomx.com',    'seller',   'BeautyGlow'),
        ('Sports Pro',      'sports@ecomx.com',    'seller',   'SportsPro'),
        ('Home Elite',      'home@ecomx.com',      'seller',   'HomeElite'),
    ]
    for name, email, role, store in demo_users:
        u = User(name=name, email=email, role=role, store_name=store)
        u.set_password('pass123')
        db.session.add(u)
    db.session.flush()

    seller_map = {u.email: u.id for u in User.query.filter_by(role='seller').all()}

    for p_data in DEMO_PRODUCTS:
        seller_email = p_data.pop('seller_email')
        p = Product(seller_id=seller_map.get(seller_email, 1), **p_data)
        db.session.add(p)

    db.session.commit()
    print(f'Seeded {len(demo_users)} users and {len(DEMO_PRODUCTS)} products.')
