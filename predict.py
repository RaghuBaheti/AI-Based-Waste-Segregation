from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image


MODEL_PATH = Path(__file__).resolve().parent / "model" / "waste_classifier_v2.keras"
CLASS_NAMES = ["general", "hazardous", "organic", "recyclable"]
model = tf.keras.models.load_model(MODEL_PATH)


def predict_waste(image_path):
    img = image.load_img(image_path, target_size=(128, 128))
    img_array = image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array, verbose=0)
    if len(predictions[0]) != len(CLASS_NAMES):
        raise ValueError(
            f"Model returned {len(predictions[0])} classes; "
            f"expected {len(CLASS_NAMES)}."
        )

    predicted_index = int(np.argmax(predictions[0]))
    return CLASS_NAMES[predicted_index], float(predictions[0][predicted_index] * 100)
