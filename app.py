import json
from random import randint, uniform
from flask import Flask, jsonify
import json
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app, origins='http://localhost:3000', supports_credentials=True)


tickets_json = '''
{
  "support_tickets": [
    {
      "ticket_id": 1,
      "customer_id": "C12345",
      "date": "2024-02-07",
      "category": "Billing",
      "description": "I was charged twice this month for my subscription. Can you please explain why this happened and correct the mistake?"
    },
    {
      "ticket_id": 2,
      "customer_id": "C12346",
      "date": "2024-02-06",
      "category": "Technical Support",
      "description": "The latest update is not compatible with my device. The app crashes every time I try to open it."
    },
    {
      "ticket_id": 3,
      "customer_id": "C12347",
      "date": "2024-02-05",
      "category": "Product Feedback",
      "description": "I love the new features introduced in the latest version! Especially the new dashboard layout is very user-friendly."
    },
    {
      "ticket_id": 4,
      "customer_id": "C12348",
      "date": "2024-02-04",
      "category": "Service Feedback",
      "description": "I had an issue with my order, and the customer service representative was extremely helpful and polite. Thank you for the great service!"
    },
    {
      "ticket_id": 5,
      "customer_id": "C12349",
      "date": "2024-02-03",
      "category": "Feature Request",
      "description": "Could you consider adding a dark mode feature to the app? It would really help reduce eye strain during nighttime use."
    },
    {
      "ticket_id": 6,
      "customer_id": "C12350",
      "date": "2024-02-02",
      "category": "Account Management",
      "description": "I'm having trouble accessing my account even after resetting my password several times. Can someone assist me with this issue?"
    },
    {
      "ticket_id": 7,
      "customer_id": "C12351",
      "date": "2024-02-01",
      "category": "Other",
      "description": "I noticed a small typo in the help documentation under the 'Getting Started' section. Just wanted to let you know!"
    }
  ]
}
'''


tickets_data = json.loads(tickets_json)

sia = SentimentIntensityAnalyzer()
@app.route('/sentiment_summary', methods=['GET'])
def sentiment_summary():
    tickets_data = json.loads(tickets_json)

    sia = SentimentIntensityAnalyzer()

    positive_count = 0
    negative_count = 0

    for ticket in tickets_data["support_tickets"]:
        score = sia.polarity_scores(ticket["description"])
        if score['compound'] > 0:
            positive_count += 1
        elif score['compound'] < 0:
            negative_count += 1

    response = {
        "positive_tickets": positive_count,
        "negative_tickets": negative_count
    }

    return jsonify(response)

def generate_fake_metrics():
    nps_score = randint(-100, 100)  
    csat_score = uniform(0, 100) 
    ces_score = uniform(1, 5)  
    churn_rate = uniform(0, 10)
    retention_rate = uniform(0, 100)  
    average_resolution_time = randint(1, 48)
    first_contact_resolution = uniform(0, 100)

    return {
        "nps_score": nps_score,
        "csat_score": csat_score,
        "ces_score": ces_score,
        "churn_rate": churn_rate,
        "retention_rate": retention_rate,
        "average_resolution_time": average_resolution_time,
        "first_contact_resolution": first_contact_resolution,
        # Add other metrics here...
    }

@app.route('/metrics', methods=['GET'])
def metrics():
    return jsonify(generate_fake_metrics())

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)