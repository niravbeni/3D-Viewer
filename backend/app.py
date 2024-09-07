from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from transformers import pipeline
from PIL import Image
import io
import os
import base64
from auth_token import AUTH_TOKEN

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"], "methods": ["GET", "POST", "OPTIONS"]}})
app = Flask(__name__, static_folder='../frontend/dist')
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://threed-viewer-309u.onrender.com", "http://localhost:5173"]}})


# Define endpoints and headers
SDXL_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}

# Initialise Midas for depth estimation
midas_pipeline = pipeline(task="depth-estimation", model="Intel/dpt-large")

def generate_image(prompt):
    response = requests.post(SDXL_API_URL, headers=headers, json={"inputs": prompt})
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")

def generate_depth_map(image_data):
    # Convert image data to PIL image
    image = Image.open(io.BytesIO(image_data))
    # Perform depth estimation using Midas 
    result = midas_pipeline(image)
    depth_map = result['depth']
    buffered = io.BytesIO()
    depth_map.save(buffered, format="PNG")
    return buffered.getvalue()

def save_image(image_data, filename):
    # Ensure the outputs directory exists
    if not os.path.exists('outputs'):
        os.makedirs('outputs')
    # Save the image to the outputs directory
    with open(os.path.join('outputs', filename), 'wb') as f:
        f.write(image_data)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400

    try:
        # Generate image using Stable Diffusion
        image_data = generate_image(prompt)
        # save_image(image_data, "generated_image.png")

        # Generate depth map using Midas
        depth_map_data = generate_depth_map(image_data)
        # save_image(depth_map_data, "depth_map.png")

        # Convert image and depth map to base64
        image_file = io.BytesIO(image_data)
        buffered = io.BytesIO()
        Image.open(image_file).save(buffered, format="PNG")
        image_str = base64.b64encode(buffered.getvalue()).decode()

        depth_map_file = io.BytesIO(depth_map_data)
        buffered = io.BytesIO()
        Image.open(depth_map_file).save(buffered, format="PNG")
        depth_map_str = base64.b64encode(buffered.getvalue()).decode()

        return jsonify({
            'image': image_str,
            'depth_map': depth_map_str
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @app.route('/', methods=['GET'])
# def home():
#     return "Image and Depth Map Generation Server is running!"

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5001)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
