from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/data', methods=['GET'])
def get_data():
    sample_data = {
        "message": "Flask сервера",
        "status": "success"
    }
    return jsonify(sample_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
