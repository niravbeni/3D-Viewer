# 3D Viewer

## Overview

This is a 3D viewer for Stable Diffusion generated images.

**Backend**: A Flask-based API, that links both Stable Diffusion for image generation, and MiDaS for the depth maps.

**Frontend**: A React + Typescipt interface that allows for entering prompts for the image generation, and an expected output that has a simple parallax effect. A debug toggle is also included to display the respectvie genertaed image and its correspondind depth map.

React Three Fiber was used for the WebGL depth effect.

## How to Use

- Enter a prompt into the text box
- Click "Generate"
- Mouseover the generated output with parallax effect
- Click and drag to reposition image
- Optional Debug checkbox toggles the input image and depth map

## Link to Deployed App

https://threed-viewer-309u.onrender.com

## How to Run Locally

1.  Setup a virtual enviroment with Python 3.10, Node.js and npm.

        python -m venv venv

        source venv/bin/activate

2.  Install all requirements

        cd backend

        pip install -r requirements.txt

3.  Create an .env file for your [Hugging Face](https://huggingface.co/settings/profile) Auth Token in the backend folder.

        AUTH_TOKEN= *******************

4.  Create the following .env file for the frontend folder

        VITE_API_URL=http://localhost:5001`

5.  Run the backend

        cd backend

        python app.py

6.  Run the frontend

        cd frontend

        npm run dev

I now need a breakdown of my entire project for my readme file, explaining my app, the pipeline, the tools used (midas, stable difussion, huggin face, flask, react three fiber, drei etc) for backend and frontend. how it was deployed as well (render). Explain how to use the app, and what is expected to appear (mouse depth effect etc). also how to run the app locally, with setup etc.

this will serve as the document outlining the solution’s design, technology used and any limitations/future improvements.

Some future improvements i figure out so far, is a ebtter looking ui, a hisotry of previously generated outputs, and a way to access history and a way to save out the images easier. Also, a more experimental and fun looking output instead of just a simple depth mouse effect. and maybe incorporating three verrtex depth as well with parallax affect.
maybe a lighter model for quickloading?
