from pathlib import Path
from uuid import uuid4

from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename

from predict import predict_waste

app = Flask(__name__)
UPLOAD_FOLDER = Path(__file__).resolve().parent / "uploads"
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024
UPLOAD_FOLDER.mkdir(exist_ok=True)


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:
        return render_template(
            "index.html",
            error="Please upload an image first."
        )

    image = request.files["image"]

    if image.filename == "":
        return render_template(
            "index.html",
            error="Please select an image."
        )

    safe_filename = secure_filename(image.filename)
    extension = Path(safe_filename).suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}:
        return render_template(
            "index.html",
            error="Please upload a supported image file."
        )

    filename = f"{uuid4().hex}{extension}"
    image_path = Path(app.config["UPLOAD_FOLDER"]) / filename
    image.save(image_path)

    try:

        waste_type, confidence = predict_waste(image_path)

        tips = {
            "general": "Place this item in the standard general waste bin.",
            "hazardous": "Handle carefully and dispose at a hazardous waste facility.",
            "organic": "Perfect for composting! Place in the organic green bin.",
            "recyclable": "Clean and dry this item before placing it in recycling."
        }

        tip = tips.get(
            waste_type,
            "Dispose of this item according to your local waste guidelines."
        )

        return render_template(
            "index.html",
            result=waste_type,
            confidence=round(confidence, 2),
            tip=tip,
            image_file=filename
        )

    except Exception as e:

        return render_template(
            "index.html",
            error=f"AI Error: {str(e)}"
        )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
