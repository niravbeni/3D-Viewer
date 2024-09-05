from flask import Flask, request, jsonify
from flask_cors import CORS
from diffusers import DiffusionPipeline
import torch
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Load SDXL model
print("Loading SDXL model...")
model_id = "stabilityai/stable-diffusion-xl-base-1.0"
pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")
print("Model loaded!")

@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.json['prompt']
    print(f"Generating image for prompt: {prompt}")
    
    # Generate image using SDXL
    image = pipe(prompt).images[0]
    
    # Convert image to base64
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return jsonify({
        'image': img_str
    })

@app.route('/', methods=['GET'])
def home():
    return "Image Generation Server is running!"

if __name__ == '__main__':
    app.run(debug=True)