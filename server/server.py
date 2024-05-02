
# flask is a model that allows you to write python service which serves HTTP requests
from flask import Flask , request , jsonify

import util

app = Flask(__name__)

@app.route('/hello')
def hello():
    return 'hello world ,This is Aarin'

# 1st routine will return the location in Bangalore city

@app.route('/get_location_names')
def get_location_names() :

    # making location in json creating
    response = jsonify({
        'locations':util.get_location_names()
    })     
    response.headers.add('Access-Control-Allow-Origin','*')

    return response 

# 2nd routine will return the predicted price by taking user input

@app.route( '/predict_home_price' , methods=['POST'] )        # 'POST' is a HTTP method by which we can create the content 
def predict_home_price( ) :
    
    # Whenever a user makes a request from HTTP , we get it through 'reguest' ( that we have import from 'flask' )

    usr_sqft = float( request.form['sqft'] )
    usr_location = request.form['location'] 
    usr_bhk = int( request.form['bhk'] )
    usr_bath = int( request.form['bath'] )

    # we get the estimated price from model and put it in a json format using 'jsonify'

    response = jsonify({
        'estimated_price' : util.get_estimate_price( usr_location , usr_sqft , usr_bath , usr_bhk )
    })

    response.headers.add('Access-Control-Allow-Origin','*')

    return response 


if __name__ == "__main__" :
    print("starting python flask server...")
    app.run()
