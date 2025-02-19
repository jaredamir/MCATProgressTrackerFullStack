from flask import Flask, jsonify
from flask_cors import CORS, cross_origin  # Import CORS
from main import get_needs_review_ratios, get_reason_for_missing_frequencies

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/data')
def needs_review_ratios():
    data = get_needs_review_ratios()
    return jsonify(data)

@app.route('/api/reason-for-missing-frequencies', methods=['GET'])
@cross_origin(supports_credentials=True)
def reason_for_missing_frequencies():
    data = get_reason_for_missing_frequencies()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
