import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from transformers import pipeline
from PIL import Image
import io
import base64
from auth_token import AUTH_TOKEN

# Determine if we're running on Render
ON_RENDER = os.environ.get('RENDER', False)

# Set the static folder path
# if ON_RENDER:
#     static_folder = '../frontend/dist'
# else:
#     static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))



app = Flask(__name__, static_folder=static_folder, static_url_path='')

# Configure CORS
if ON_RENDER:
    CORS(app, resources={r"/*": {"origins": "https://threed-viewer-309u.onrender.com"}})
else:
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Define endpoints and headers
SDXL_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}

# Initialize Midas for depth estimation
midas_pipeline = pipeline(task="depth-estimation", model="Intel/dpt-large")

def generate_image(prompt):
    response = requests.post(SDXL_API_URL, headers=headers, json={"inputs": prompt})
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")

def generate_depth_map(image_data):
    image = Image.open(io.BytesIO(image_data))
    result = midas_pipeline(image)
    depth_map = result['depth']
    buffered = io.BytesIO()
    depth_map.save(buffered, format="PNG")
    return buffered.getvalue()

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    try:
        image_data = generate_image(prompt)
        depth_map_data = generate_depth_map(image_data)
        
        image_str = base64.b64encode(image_data).decode()
        depth_map_str = base64.b64encode(depth_map_data).decode()
        
        return jsonify({
            'image': image_str,
            'depth_map': depth_map_str
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health-check')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=not ON_RENDER)

# Print static folder path for debugging
print(f"Static folder path: {app.static_folder}")