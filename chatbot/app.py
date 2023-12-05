from flask import Flask, render_template, request , jsonify
from flask_cors import CORS
from chat import get_response
app = Flask(__name__)
CORS(app)


@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    response = get_response(text)
    messsage = {"answer": response}
    return jsonify(messsage)

if __name__ == "__main__":
    app.run(host='localhost', port=3001, debug=True)
