import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload', __name__)

ALLOWED = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


def _allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED


@upload_bp.post('/')
@jwt_required()
def upload_image():
    if 'image' not in request.files:
        return jsonify(error='No image file provided.'), 400
    f = request.files['image']
    if not f or f.filename == '':
        return jsonify(error='No file selected.'), 400
    if not _allowed(f.filename):
        return jsonify(error='Allowed types: PNG, JPG, JPEG, GIF, WEBP.'), 400

    ext      = f.filename.rsplit('.', 1)[1].lower()
    filename = str(uuid.uuid4()) + '.' + ext

    folder = current_app.config.get('UPLOAD_FOLDER', '')
    os.makedirs(folder, exist_ok=True)
    f.save(os.path.join(folder, filename))

    return jsonify(url='/assets/uploads/' + filename, filename=filename), 200
