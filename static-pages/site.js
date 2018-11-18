var all_json_locations = [];

function store_location(){
    console.log("running store location");
    var obj = {
        long: document.getElementById("long").value,
        lat: document.getElementById("lat").value
    };
    all_json_locations.push(obj);

    var ul = document.getElementById("location-list");
    var li = document.createElement("li");

    li.appendChild(document.createTextNode(JSON.stringify(obj)));
    ul.appendChild(li);

   document.getElementById("long").value = "";
   document.getElementById("lat").value = "";
}

var submit_button = document.querySelector('#submit-button');

submit_button.addEventListener("click", function(e){
    store_location();
});

document.querySelector("#test-button").addEventListener("click", function(e){
    console.log("test-button clicked");
    $.post('/rand',
           function(response_text){
               console.log(response_text);
           }
          );
}
                                                       );
