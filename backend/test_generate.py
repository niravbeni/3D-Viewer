import requests
import json

# Define the URL of your Flask server
FLASK_URL = "http://127.0.0.1:5000/generate"

def test_generate(prompt):
    # Prepare the payload
    payload = {
        "prompt": prompt
    }

    # Send POST request to Flask server
    response = requests.post(FLASK_URL, json=payload)

    # Check if the request was successful
    if response.status_code == 200:
        # Print the JSON response
        print("Response JSON:")
        print(json.dumps(response.json(), indent=4))
    else:
        print(f"Request failed with status code {response.status_code}: {response.text}")

if __name__ == "__main__":
    # Example prompt
    prompt = "island with palm trees and clear blue water"
    
    # Call the test function
    test_generate(prompt)
