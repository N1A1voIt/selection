from io import BytesIO

import requests
import torch
from PIL import Image
from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import CLIPProcessor, CLIPModel

from audio import audio
from theme import theme_creator

app = Flask(__name__)
app.config['ALLOWED_EXTENSIONS'] = {'wav'}

CORS(
    app,
    origins=["http://localhost:4200"],
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True,
    max_age=3600
)


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/overlay', methods=['POST'])
def upload_file():
    if 'audio' not in request.files:
        return jsonify({'error': 'Vous devez rajouter un audio de votre part'}), 400

    og_audio = request.files['audio_base']
    to_add = request.files['audio']

    overlayed = audio.overlay_audio(og_audio, to_add)

    try:
        overlayed = audio.overlay_audio(og_audio, to_add)
        return jsonify({"success": True, "result": overlayed})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api', methods=['GET'])
def get_data():
    data = {"message": "Hello, World!"}
    return jsonify(data)

@app.route('/api', methods=['POST'])
def post_data():
    new_data = request.json
    return jsonify(new_data), 201



# Load the pre-trained CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def validate_image_with_prompt(image_path, prompt):
    """ Validates the image against the given prompt using CLIP model """
    # Open image using PIL (can be from local file or URL)
    if image_path.startswith('http'):
        # If the image path is a URL
        response = requests.get(image_path)
        img = Image.open(BytesIO(response.content))
    else:
        # If the image path is a local file
        img = Image.open(image_path)

    # Process the image and prompt using CLIPProcessor
    inputs = processor(text=prompt, images=img, return_tensors="pt", padding=True)

    # Get model predictions
    with torch.no_grad():
        outputs = model(**inputs)

    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)
    similarity_score = probs.item()

    return similarity_score

@app.route('/validate-image', methods=['POST'])
def validate_image():
    try:
        image_file = request.files['image']
        prompt = request.form['prompt']

        image_path = f"/tmp/{image_file.filename}"
        image_file.save(image_path)

        similarity_score = validate_image_with_prompt(image_path, prompt)

        result = {
            "similarity_score": similarity_score,
            "match": "The image matches the prompt!" if similarity_score > 0.5 else "The image does not match the prompt."
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/generate-theme', methods=['GET'])
def generate_theme():
    res = theme_creator.create_theme();
    return jsonify(res)

if __name__ == '__main__':
    app.run(debug=True)

