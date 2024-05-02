
// This fucntion will dynamically loads all the locations from server ( by raising HTTP request - GET )

function onPageLoad(){

    console.log( "document loading");

    // var url = "http://127.0.0.1:5000/predict_home_price";             // Use this if you are NOT using nginx and want host it in localHost
     var url = "/api/predict_home_price";                                // Use this if you are using nginx and want to host it in cloud (AWS)


    $.get( url , function(data , status){                               // '$' is the syntax used in jquery to send GET request

        console.log("got response for get_location_names request");
        console.log(data);
        if(data){
            
            var locations = data.locations;                              // As we seen in PostMan appl ,we get the json response and it is been accessed here
            var uiLocations = document.getElementById("uiLocations");

            $('#uiLocations').empty();

            var optionElement = document.createElement("option");

            optionElement.value = "";
            optionElement.disabled = true;
            optionElement.selected = true;
            optionElement.textContent = "Choose a Location";

            $('#uiLocations').append(optionElement);

            for( var i in locations ){
                var opt = new Option(locations[i]);     // This will create new Option tag and add the locations
                $('#uiLocations').append(opt);
            } 
        }

    });


}

window.onload = onPageLoad ;   // this will initial call the function OnPageLoad() at every reload of page

// These functions will get user data from HTML :

function getBathValue(){

    var bathrooms = document.getElementsByName("uiBathrooms")
    
    for( var i in bathrooms ){
        if( bathrooms[i].checked){
            selected_value = bathrooms[i].value;
            return selected_value;   
        }
    }
    return -1;   //if invalid value is been selected

}

function getBHKValue(){

    var bhk = document.getElementsByName("uiBHK")
    
    for( var i in bhk ){
        if( bhk[i].checked){
            selected_value = bhk[i].value;
            return selected_value;   
        }
    }
    return -1;
}

// This function checks whether the location is choosen or it is in this default value :

function Submit_userDetail(){

    var location_frm_user = document.getElementById("uiLocations");
    var errormsg = document.getElementById("errormsg");

    console.log(location_frm_user.options[location_frm_user.selectedIndex].value)

    if(location_frm_user.value ===""){
        errormsg.style.display = "block"
        return;
    }
    else{
        errormsg.style.display = "none"
        EstimatePrice()
    }

}

// This functions will send the user data ( by raising HTTP request - POST) and predicts the price using pre-trained ML model

function EstimatePrice(){

    console.log("Estimate price button clicked");

    var sqft_frm_user = document.getElementById("uiSqft");
    var bhk_frm_user = getBHKValue();
    var bath_frm_user = getBathValue();
    var location_frm_user = document.getElementById("uiLocations");
    
    // var url = "http://127.0.0.1:5000/get_location_names";        // Use this if you are NOT using nginx and want host it in localHost
    var url = "/api/get_location_names";                            // Use this if you are using nginx and want to host it in cloud (AWS)


    $.post( url , {                                     // using the above url ,we are post user_data and calling predict_home_price() function ( function call will automatically takes place when POST request is sent) 
        sqft: parseInt( sqft_frm_user.value) ,
        location : location_frm_user.value ,
        bhk : bhk_frm_user ,
        bath : bath_frm_user
    } ,function( data , status ){

        if(data){
            
            console.log( data.estimated_price )   // This data is in JSON format as we seen in PostMan appl
            
            var price = document.getElementById("price");
            price.textContent = data.estimated_price + " Lakh";
            
            var popup_div = document.getElementById("popupID");
            popup_div.style.display = "flex" ;
        }

    })

}

// this function will close the popup tab :

function close_popup() {
    var popup_div = document.getElementById("popupID")
            popup_div.style.display = "none" ;
}
