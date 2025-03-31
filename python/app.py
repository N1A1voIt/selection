from flask import Flask, jsonify, request
from flask_cors import CORS

from audio import audio

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

    return jsonify({"success": overlayed})

@app.route('/api', methods=['GET'])
def get_data():
    data = {"message": "Hello, World!"}
    return jsonify(data)

@app.route('/api', methods=['POST'])
def post_data():
    new_data = request.json
    return jsonify(new_data), 201

if __name__ == '__main__':
    app.run(debug=True)
