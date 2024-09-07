# 3D Viewer

## Overview

This is a 3D viewer for Stable Diffusion generated images.

### Backend

A Flask-based API that links both Stable Diffusion for image generation and MiDaS for depth maps.

- **Flask**: Python-backed web framework for backend API
- **MiDaS** (from Hugging Face Transformers): Pre-trained depth estimation model
- **Stable Diffusion XL** (Hugging Face API): Text-to-image model
- **Gunicorn**: WSGI HTTP server for production

### Frontend

A React + TypeScript interface that allows for entering prompts for image generation, with an expected output that has a simple parallax effect. A debug toggle is also included to display the respective generated image and depth map.

- **Vite**: Build tool for the frontend
- **React / TypeScript / Styled Components**: For the user interface design
- **Three.js / React Three Fiber / Drei**: For the 3D depth effect

### Deployment

- **Render**: Cloud platform for the production build

## How to Use

1. Enter a prompt in the input field (e.g. "Man riding a dinosaur").
2. Click "Generate" to create the output.
3. Mouseover the generated output to see the parallax effect.
4. Click and drag to reposition the image.
5. Optional: Use the Debug checkbox to toggle the original generated image and depth map.

## Link to Deployed App

[https://threed-viewer-309u.onrender.com](https://threed-viewer-309u.onrender.com)

## Setup & Installation

1.  Clone the repo:

        git clone https://github.com/niravbeni/3D-Viewer.git
        cd 3d-image-viewer

2.  Setup the backend:

        cd backend
        python -m venv venv
        source venv/bin/activate # On Windows use `venv\Scripts\activate`
        pip install -r requirements.txt

3.  Create an .env file in backend directory with for your [Hugging Face](https://huggingface.co/settings/profile) Auth Token:

        AUTH_TOKEN=your_huggingface_auth_token

4.  Setup the frontend:

        cd ../frontend
        npm install

5.  Run the backend

        cd ../backend
        python app.py

6.  Run the frontend

        cd frontend
        npm run dev

## Future Improvements

1. Develop a more appealing and intuitive user interface.
2. Implement a history feature to store and display previously generated outputs.
3. Add save, export, and sharing functionality.
4. Develop more experimental or advanced visualizations for the output image.
5. Use more optimized or lighter ML models.
6. Develop a mobile version of the app.

## Limitations

1. Processing time is slow due to deployment instance and model sizes.
2. Fluctuations in generated image quality.
