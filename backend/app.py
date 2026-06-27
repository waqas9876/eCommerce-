import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt


def create_app():
    frontend = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

    app = Flask(__name__, static_folder=frontend, static_url_path='')
    app.config.from_object(Config)
    app.config['UPLOAD_FOLDER']       = os.path.join(frontend, 'assets', 'uploads')
    app.config['MAX_CONTENT_LENGTH']  = 5 * 1024 * 1024  # 5 MB

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r'/api/*': {'origins': '*', 'expose_headers': ['Content-Type']}})

    # ── Register API blueprints ──────────────────────────────────────────
    from routes.auth     import auth_bp
    from routes.products import products_bp
    from routes.orders   import orders_bp
    from routes.cart     import cart_bp
    from routes.admin    import admin_bp
    from routes.upload   import upload_bp

    app.register_blueprint(auth_bp,     url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp,   url_prefix='/api/orders')
    app.register_blueprint(cart_bp,     url_prefix='/api/cart')
    app.register_blueprint(admin_bp,    url_prefix='/api/admin')
    app.register_blueprint(upload_bp,   url_prefix='/api/upload')

    # ── Serve frontend (catch-all) ───────────────────────────────────────
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path.startswith('api/'):
            return jsonify(error='Not found.'), 404
        full = os.path.join(app.static_folder, path)
        if path and os.path.isfile(full):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    # ── JWT error handlers ───────────────────────────────────────────────
    @jwt.unauthorized_loader
    def unauth(reason):
        return jsonify(error='Authentication required.', reason=reason), 401

    @jwt.expired_token_loader
    def expired(header, payload):
        return jsonify(error='Session expired. Please log in again.'), 401

    # ── Create tables + seed on first run ────────────────────────────────
    with app.app_context():
        db.create_all()
        from seed import seed
        seed()

    return app


if __name__ == '__main__':
    application = create_app()
    application.run(debug=True, port=5000)
