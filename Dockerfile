FROM python:3.10
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Hugging Face runs on port 7860 by default
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]