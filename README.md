# AI Waste Segregation

A Flask web app that classifies uploaded waste images as general, hazardous,
organic, or recyclable using a TensorFlow/Keras model.

## Run with Docker

Docker is the recommended way to run the application, especially on Windows.
From the project directory:

```powershell
docker build -t ai-waste-segregation .
docker run --rm -p 7860:7860 ai-waste-segregation
```

Open <http://localhost:7860>.

## Run locally

Use Python 3.10 and install the dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open <http://localhost:5000>. The trained model file
`model/waste_classifier_v2.keras` must be present.

Uploaded images are stored in the local `uploads/` directory and are excluded
from Git.
