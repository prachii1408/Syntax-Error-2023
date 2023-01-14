

function initMap(){
    const directionsRenderer=new google.maps.DirectionsRenderer();
    const directionsService=new google.maps.DirectionsService();
    const map=new google.maps.Map(document.getElementById("map"),{
        zoom:14,
        center:{lat:29.8659,lng:77.8963}
    })
    directionsRenderer.setMap(map);
    calculate(directionsService,directionsRenderer);
    document.getElementById("mode").addEventListener("change",()=>{
        calculate(directionsService,directionsRenderer);
    })

    var options={
        types:['(cities)']
    }
    var input1=document.getElementById("from");
    var autocomplete1=new google.maps.places.Autocomplete(input1,options);
    var input2=document.getElementById("to");
    var autocomplete2=new google.maps.places.Autocomplete(input2,options);
}
function calculate(directionsService,directionsRenderer){
    const selectedMode=document.getElementById("mode").value;

    directionsService.route({
     origin:document.getElementById("from").value ,
     destination:document.getElementById("to").value,

     travelMode:google.maps.TravelMode[selectedMode],
    })

    .then((response)=>{
        directionsRenderer.setDirections(response);
    })
    .catch((e)=>window.alert("Direction request failed "))
}