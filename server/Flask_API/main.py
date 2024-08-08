from flask import Flask, request, jsonify 
import pandas as pd
import joblib
from machineLearningModel import create_json_object

app = Flask(__name__)

# "root" is an API endpoint

@app.route("/")
def home():
    return "home" 


# GET REQ
#======================

# take in parameter from url and output json on page
# http://127.0.0.1:5000/get-user/123?extra=hello -> url test
# <user_id> is a dynamic path parameter
@app.route("/get-user/<user_id>", methods=["GET"])
def get_user(user_id):

    user_data = {
        "user_id": user_id, # from parameter
        "name": "azlie",
        "email": "azlie@gmail.com"
    }

    # accesing extra query paramater from url
    extra = request.args.get("extra")
    # check if extra exist
    if extra: 
        user_data["extra"] = extra

    return jsonify(user_data),200


# endpoint to send to node
@app.route("/get-data", methods=["GET"])
def get_data():

    user_data = create_json_object()

    return jsonify(user_data),200


# endpoint to send to node
@app.route("/process-data", methods=["POST"])
def process_data():

    try:
        # Get the JSON data sent from the Node.js server
        data = request.json

        # Extract required fields from the JSON data
        room_num = data['roomNum']
        area = data['area']
        timestamp = data['timestamp']  # If included in the data

        # Construct the response JSON object
        response_data = {
            'success': True,
            'message': 'Data processed successfully',
            'roomNum': room_num,
            'area': area,
            'timestamp': timestamp
        }

        # Return the response as JSON
        return jsonify(response_data)

    except Exception as e:
        # Handle any errors
        print("Error processing data:", e)
        return jsonify({'error': 'Internal Server Error'}), 500



# GET REQ END
#======================


# POST REQ
#======================

# sending json object below to the server
# {
#     "name": "azlie"
# }
@app.route("/create-user", methods=["POST"])
def create_user():
    data = request.get_json()

    return jsonify(data),201


# PREDICTION MODEL 
# ===========================================================

# Load the trained model
model_pipeline = joblib.load('prediction_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the JSON data from the request
    data = request.get_json()
    
    # Convert the JSON data to a DataFrame
    new_data = pd.DataFrame(data)
    
    # Make predictions
    predictions = model_pipeline.predict(new_data)
    
    # Return the prediction as JSON
    return jsonify({'predicted_price': predictions[0]})


# FORECASTING MODEL 
# ===========================================================

# Load the model
model = joblib.load('random_forest_model.pkl')

# Define the Flask route for forecasting
@app.route('/forecast', methods=['POST'])
def forecast():
    # Get the input data from the request
    data = request.json

    # Prepare the data as a DataFrame
    input_data = pd.DataFrame(data, index=[0])

    # Ensure the column order matches the model's expectations
    input_data = input_data[["Mortgage Interest", "Vacancy Rate", "CPI", "Median Sales Price"]]

    # Make prediction
    prediction = model.predict(input_data)

    # Return the prediction as a JSON response
    return jsonify({'forecast_median_house_price': prediction[0]})

# POST REQ END
#======================




if __name__ == "__main__":
    app.run(debug=True)