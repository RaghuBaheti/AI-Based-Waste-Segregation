from pathlib import Path
from uuid import uuid4

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from predict import predict_waste

app = Flask(__name__)
CORS(app)  # Allow React frontend to call from any origin

UPLOAD_FOLDER = Path(__file__).resolve().parent / "uploads"
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024
UPLOAD_FOLDER.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}

TIPS = {
    "general": "Place this item in the standard general waste bin.",
    "hazardous": "Handle carefully and dispose at a hazardous waste facility.",
    "organic": "Perfect for composting! Place in the organic green bin.",
    "recyclable": "Clean and dry this item before placing it in recycling.",
}


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/")
def home():
    return jsonify({"status": "EcoVision AI backend is running ✅"})


@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:
        return jsonify({"error": "Please upload an image first."}), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({"error": "Please select an image."}), 400

    safe_filename = secure_filename(image.filename)
    extension = Path(safe_filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Please upload a supported image file (JPG, PNG, GIF, BMP, WEBP)."}), 400

    filename = f"{uuid4().hex}{extension}"
    image_path = Path(app.config["UPLOAD_FOLDER"]) / filename
    image.save(image_path)

    try:
        waste_type, confidence = predict_waste(image_path)
        tip = TIPS.get(waste_type, "Dispose of this item according to your local waste guidelines.")

        return jsonify({
            "result": waste_type,
            "confidence": round(confidence, 2),
            "tip": tip,
            "image_url": f"/uploads/{filename}",
        })

    except Exception as e:
        return jsonify({"error": f"AI Error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
