import json
import pickle
import numpy as np
import warnings

__locations = None
__data_columns = None
__model = None

def get_location_names() :

    return __locations

def get_estimate_price( loc , sqft , bath , bhk ) :       # this function takes user inputs from frontend and predicts the price using the model we trained

    load_saved_artifacts()

    try :
        loc_ind = __data_columns.index( loc.lower() )        # gets the index of user location from '__data_columns' list
    except :
        loc_ind = -1 

    
    x = np.zeros( len(__data_columns) )
    
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    
    if loc_ind>=0 :
        x[ loc_ind ] = 1                                  # we make it 1 , because ,we create dummy columns of location and applied one-hot-encoding                                 

    # successfully created a list of user data 

    warnings.filterwarnings('ignore')                     # ignores warnings given by the model

    estimated_price = __model.predict([x])[0]             # model takes 2-D array and returns 2-D array , hence we use indexing ( [0] )
    return round( estimated_price , 2 )                  # returning the price        

def load_saved_artifacts() :                     # This function creates intances of artifacts that we built 

    global __data_columns
    global __locations
    global __model

    with open("./server/artifacts/bengaluru_location_columns.json" , "r" ) as f :
        __data_columns = json.load(f)['data_columns']                                # This brings all the columns into "__data_columns"
        __locations = __data_columns[3:]                                             # This brings only the location columns leaving (sqft , bath , bhk ) into "__locations"

    with open("./server/artifacts/bengaluru_home_price_predicting_model.pickle" , "rb") as f :
        __model = pickle.load(f)                                                     # This is the model we trained that is been imported

    print("loading saved artifacts..done")



if __name__ != '__main__' :

    print("load_saved_artifacts function is called")
    load_saved_artifacts()

elif __name__ == '__main__' :
    
    print(__locations)

    print( get_estimate_price( '1st Phase JP Nagar' , 1000 , 3 , 3) )
    print( get_estimate_price( '1st Phase JP Nagar' , 1000 , 2 , 2) )
    print( get_estimate_price( 'Kalhalli' , 1000 , 2 , 2) )
    print( get_estimate_price( 'whitefield' , 1000 , 3 , 3) )