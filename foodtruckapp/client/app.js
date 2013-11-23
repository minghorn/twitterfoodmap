Session.set("page","landing");


Template.SignUp.events = {
  		'click input.add': function () {
  			var name = document.getElementById("name").value;
  			var contact = document.getElementById("phone").value;
  			var description = document.getElementById("food").value;
  			var twitter = document.getElementById("twitter").value;
  			var e = document.getElementById("categories");
  			var category= e.options[e.selectedIndex].value;
  			//trucks.insert({name: name, contact: contact, description: description, picture: picture, 
  				//category:category,});
			//NEED A WAY TO SEND THE INFO TO US TO REVIEW AND THEN APPROVE BEFORE BEING INSERTED INTO DATABASE
  			
  			Session.set("page","Categories");
  			},
  		'click input.back': function () {
  			Session.set("page","Categories");
  		},
  		
	

  	
  	};
Template.backButton.events = {
	"click input.Back": function () {
		Session.set("page","Categories");
	},
};

  		
Template.Foodlist.Food_Trucks = function (category) {
    return trucks.find({category:category},{sort: {location:1}});
    
  	
	};

Template.FoodList.getPage = function (){
	 return Session.get("page");

	};

Template.Categories.events = {
	'click input.Asian': function () {
	Session.set("page","Asian");
	},
	'click input.Register': function () {
	Session.set("page","SignUp");
	},
	'click input.Mexican': function () {
	Session.set("page","Mexican");
	},
	'click input.Sandwiches': function () {
	Session.set("page","Sandwiches");
	},
	'click input.BBQ': function () {
	Session.set("page","BBQ");
	},
	'click input.Other': function () {
	Session.set("page","Other");
	},
	'click input.Dessert': function () {
		Session.set("page", "Dessert")
	},	
  };

Template.landing.events = {
	'click input.hola': function (){
		getPos();
		Session.set("page", "Map")
	}
}

//SETS WHAT VIEW THE BODY TEMPLATE IS SHOWING 
Template.bodyTemplate.isFTlist= function(){
	return Session.equals("page","FTlist");
	};
Template.bodyTemplate.isSignUp= function(){
	return Session.equals("page","SignUp");
};
Template.bodyTemplate.islanding = function(){
	return Session.equals("page","landing");
};

//NEED DATA GET FUNCTION
var data;
var markers = [];
function callback(inp){
  data = inp;
  console.log(inp);
  for (var i = data.length - 1; i >= 0; i--) {
    data[i].id = i + 1;
    data[i].latitude = Number(data[i].latitude);
    data[i].longitude = Number(data[i].longitude);
  };
  console.log(data);
}




function distance(a1, b1, a2, b2){
  var distance = Math.sqrt(((a1 - a2) * (a1 - a2)) + ((b1 - b2) * (b1 - b2)));
  return distance;
};

function ltg(a,b){
  return a-b;
};   



function addMarker(obj, contentString) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(obj.latitude,obj.longitude),
      map: map
  });
  var infoWindow = new google.maps.InfoWindow({
    content: contentString
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map,marker);
  });
  markers.push(marker);
};
function setAllMap(map){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
function clearMarkers(){
  setAllMap(null);
}
function deleteMarkers(){
  clearMarkers();
  markers = [];
}
//FIND NEAREST
function findNearest(lat, lon, amt){
  var nearest = [];
  var all = [];
  var hold = [];
  for (var i = 0; i < data.length; i++) {
    if(data[i].longitude != undefined){
      all[i] = distance(data[i].longitude, data[i].latitude, lon, lat);
    }
  }
  for(var m = 0; m < all.length; m++){
    hold[m] = all[m];
  }
  hold.sort(ltg);
  for(var j = 0; j < amt; j++){
    for (var k = 0; k < all.length; k++) {
      if(hold[j] == all[k]){
        nearest[nearest.length] = k;
      }
    };      
  }
  var result = [];
  nearest.forEach(function(value){
    result.push(data[value]);
  });
  return result;
};

//GET CURRENT POSITION
function getPos(cb) {
  navigator.geolocation.getCurrentPosition(
      cb,
      function(error){
        alert(error.message);
      }, {
        enableHighAccuracy: true
    ,timeout : 5000
      }
      );
}

function placeMarkers() {
  deleteMarkers();
  getPos(function(pos) {
    var nearestFoodTruckMarkers = findNearest(pos.coords.latitude, pos.coords.longitude, $('#select1').val());
    for (var i = nearestFoodTruckMarkers.length - 1; i >= 0; i--) {
      var infoWindowContent = '<ul><li><b>'+ nearestFoodTruckMarkers[i].applicant + '</b></li> <br/><li>'+ nearestFoodTruckMarkers[i].address + '</li><br/><li id=bottom>' + nearestFoodTruckMarkers[i].fooditems+'</li><br/></ul>' ;
      addMarker(nearestFoodTruckMarkers[i], infoWindowContent);
      var div = document.getElementById('.truckInfo');
      $('.truckInfo').append(infoWindowContent);
    };
  }); 
}
 


 
 
 
  