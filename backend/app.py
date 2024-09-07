import os
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from transformers import pipeline
from PIL import Image
import io
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Determine if we're running on Render
ON_RENDER = os.environ.get('RENDER', 'false').lower() == 'true'

# Set the static folder path
static_folder = '../frontend/dist' if ON_RENDER else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = Flask(__name__, static_folder=static_folder, static_url_path='')

# Configure CORS
if ON_RENDER:
    CORS(app, resources={r"/*": {"origins": "https://threed-viewer-309u.onrender.com"}})
else:
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load AUTH_TOKEN from environment variable
AUTH_TOKEN = os.getenv('AUTH_TOKEN')
if not AUTH_TOKEN:
    logger.error("AUTH_TOKEN is not set in environment variables")
    raise ValueError("AUTH_TOKEN is not set")

# Define endpoints and headers
SDXL_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}

# Initialize Midas for depth estimation
try:
    midas_pipeline = pipeline(task="depth-estimation", model="Intel/dpt-large")
except Exception as e:
    logger.error(f"Failed to initialize Midas pipeline: {e}")
    midas_pipeline = None

def generate_image(prompt):
    try:
        response = requests.post(SDXL_API_URL, headers=headers, json={"inputs": prompt}, timeout=30)
        response.raise_for_status()
        return response.content
    except requests.RequestException as e:
        logger.error(f"Error generating image: {e}")
        raise

def generate_depth_map(image_data):
    if midas_pipeline is None:
        raise ValueError("Midas pipeline is not initialized")
    try:
        image = Image.open(io.BytesIO(image_data))
        result = midas_pipeline(image)
        depth_map = result['depth']
        buffered = io.BytesIO()
        depth_map.save(buffered, format="PNG")
        return buffered.getvalue()
    except Exception as e:
        logger.error(f"Error generating depth map: {e}")
        raise

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
        logger.error(f"Error in generate endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@app.route('/health')
def health():
    return "OK", 200

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

logger.info(f"Static folder path: {app.static_folder}")
logger.info(f"RENDER environment: {ON_RENDER}")