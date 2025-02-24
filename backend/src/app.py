from flask import Flask, jsonify
from flask_cors import CORS, cross_origin  # Import CORS
from main import get_needs_review_ratios, get_reason_for_missing_frequencies
from analyticFunctions import get_reason_for_missing_frequencies, get_topics_related_to_missed_questions, get_test_section_scores, get_topics_lacking_in_understanding_frequncies

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/data')
def needs_review_ratios():
    data = get_needs_review_ratios()
    return jsonify(data)

@app.route('/api/get_all_analytics')
@cross_origin(supports_credentials=True)
def get_all_analytics():
    try:
        response_data = {}
        reason_data = get_reason_for_missing_frequencies()
        if reason_data:
            response_data["Reason For Missing"] = {
                "graphType": "Pie",
                "data": reason_data
            }

        topics_data = get_topics_related_to_missed_questions()
        if topics_data:
            response_data["Frequency of Topics Relating To Missed Questions"] = {
                "graphType": "Bar",
                "data": topics_data
            }

        section_data = get_test_section_scores()
        if section_data:
            response_data["Section Scores"] = {
                "graphType": "Bar",
                "data": section_data
            }

        topics_understanding_data = get_topics_lacking_in_understanding_frequncies()
        if topics_understanding_data:
            response_data["Topics Lacking in Understanding"] = {
                "graphType": "Pie",
                "data": topics_understanding_data
            }

        return jsonify(response_data)

    except Exception as e:
        app.logger.error(f"error in route get_all_analytics: {e}")
        return '', 500


@app.route('/api/reason-for-missing-frequencies', methods=['GET'])
@cross_origin(supports_credentials=True)
def reason_for_missing_frequencies():
    data = get_reason_for_missing_frequencies()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
