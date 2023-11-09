from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

import os
from dotenv import load_dotenv

load_dotenv()

appId = os.getenv("APP_ID")
apiKey = os.getenv("API_KEY")


app = Flask(__name__)
CORS(app)  # Handle CORS for frontend integration

currentRequestId = ""

mpx_host = "https://api.genai.masterpiecex.com/v1"
get_status_url = mpx_host + "/status/"
generate_dir = {
    "Object": "/functions/object",
    "Animal": "/functions/animal",
    "Human": "/functions/human",
}


@app.route("/submit", methods=["POST"])
def submit():
    global currentRequestId
    data = request.json
    prompt = data["text"]
    category = data["category"]

    payloadinfo = {
        "paintPromptNeg": "blurry, low quality, low res",
        "meshVariability": 2,
        "isCreative": False,
        "meshPrompt": prompt,
        "paintPromptPos": prompt
    }

    if category == "Human":
        payloadinfo["animationType"] = "animate"
        payloadinfo["animationPrompt"] = data["animationPrompt"]

    headers = {
        'Content-Type': 'application/json',
        'x-apikey': apiKey
    }

    gen_url = mpx_host + generate_dir[category]

    response = requests.post(gen_url, headers=headers, json=payloadinfo)

    currentRequestId = response.json().get("requestId", "")
    return jsonify(response.json())

@app.route("/check-status", methods=["GET"])
def check_status():
    global currentRequestId
    headers = {
        'x-apikey': apiKey
    }

    response = requests.get(get_status_url + currentRequestId, headers=headers)
    return response.text

if __name__ == "__main__":
    app.run(debug=True)
