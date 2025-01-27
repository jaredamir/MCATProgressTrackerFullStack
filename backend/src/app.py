from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from main import get_needs_review_ratios

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/data')
def get_data():
    data = get_needs_review_ratios()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
