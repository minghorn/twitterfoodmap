var map = null;
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.789, -122.3958),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions); 
}
google.maps.event.addDomListener(window, 'load', initialize);

