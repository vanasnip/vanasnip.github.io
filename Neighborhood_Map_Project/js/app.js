
var map;

// Create a new blank array for all the listing markers.
var markers = [];
var Query = ko.observable(""); //element typed into  input

function Model(){
  var galleryMarkers = [{
    title: "National Gallery London",
    location: {lat: 51.508926, lng: -0.128285},
    streetAddress: "Trafalgar Square",
    cityAddress: "London, WC2N 5DN",
    id: "nav0",
    visible: ko.observable(true),
    isMarker: true
  },{
    title: "National Portrait Gallery",
    location: {lat: 51.509422, lng: -0.128122},
    streetAddress: "St. Martin's Pl",
    cityAddress: "London WC2H 0HE",
    id: "nav0",
    visible: ko.observable(true),
    isMarker: true
  },{
    title: "Tate Modern",
    location: {lat: 51.507594, lng: -0.099357},
    streetAddress: "Bankside",
    cityAddress: "London SE1 9TG",
    id: "nav0",
    visible: ko.observable(true),
    isMarker: true
  },{
    title: "Saatchi Gallery",
    location: {lat: 51.490696, lng: -0.158716},
    streetAddress: "Duke Of York's HQ, King's Rd",
    cityAddress: "London SW3 4RY",
    id: "nav0",
    visible: ko.observable(true),
    isMarker: true
  },{
    title: "Natural History Museum",
    location: {lat: 51.496714, lng: -0.176372},
    streetAddress: "Cromwell Rd",
    cityAddress: "London SW7 5BD",
    id: "nav0",
    visible: ko.observable(true),
    isMarker: true
  },{
    title: "Tate Britain",
    location: {lat: 51.491062, lng: -0.127788},
    streetAddress: "Millbank, Westminster",
    cityAddress: "London SW1P 4RG",
    id: "nav0",
    visible: ko.observable(true),
    isMarker: true
  }];

  return galleryMarkers;
}

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.508926, lng: -0.128285},
    zoom: 13
  });
  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var locations = Model();
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var streetAddress = locations[i].streetAddress;
    var cityAddress = locations[i].cityAddress;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i,
    });
    // Push the marker to our array of markers.
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow, streetAddress, cityAddress);
			toggleBounce(this); //click to start and stop bounce when marker clicked
    });
    //add to markers array
    marker.street = streetAddress;
    marker.city = cityAddress;
    markers.push(marker);
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

  $('.recenter').click(function(){
    map.fitBounds(bounds);
    $('.recenter').css('display','none');
    jQuery(".locations").removeClass('selected');
  });

  var markerLoad = function(data) {
    //bount to sidebar links giving access to marker behaviour
    this.position = ko.observable(data.position);
    this.title = ko.observable(data.title);
    this.clickable = function(){
		//open info window when clicked
    populateInfoWindow(data, largeInfowindow);
		//bounce animation when clicked
		toggleBounce(data);
    };
  };

  var ViewModel = function(){
    var self = this;
    //creates array to search through and compare with input
    function ultimateList(){
      var clickableArray =[];
      for(var i = 0; i < markers.length; i++){
        clickableArray[i] = new markerLoad(markers[i]);
      }
      return clickableArray;
    }
    this.setMarker = function(clickedMarker){
      clickedMarker.clickable(); //when side bar link is clicked open infowindow for selected location
    };
    this.searchResults = ko.computed(function() {
        var q = Query();// typed into input to be compared
        return ultimateList().filter(function(i) {
          return i.title().toLowerCase().indexOf(q) >= 0;//compare all location in array with input only return matching
      });
    });
  };
  ko.applyBindings(new ViewModel());
  $(".locations").click(function(){//highlight last link in sidebar to be clicked
				$(".locations").removeClass('selected');
				$(this).toggleClass('selected');
  });
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div class="markers marker0'+ marker.id + '">' + getFlickerImage(marker) + '</div>');
    map.setZoom(15);
    map.setCenter(marker.getPosition());
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
			marker.setAnimation(null); // stop bounce when infowindow is closed
      infowindow.marker = (null);
    });
    $('.recenter').css('display','block');
  }
}

function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
	} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

function getFlickerImage(marker){
  var self = this;
  // modURL makes aurl thats icluded search for this marker title
  var getURL = modURL(marker);
  searchFlickr(getURL);

  function modURL(modMarker){ //Modify URL for spcific marker
    var searchText = modMarker.title;
    //replace spaces with "+" to make it URL friendly
    searchText = searchText.replace(/\s+/g, '+');
    var URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=fd46fabfe3102f771ee0e03a437febf4&text=" + searchText +      "&page=1&format=json&jsoncallback=?";
    console.log(URL);
    return URL;
  }
  function searchFlickr(url){
    //accessing flicker API
    $.getJSON(url, displayImages1);
    //This function actually does something with the data after it has been read in from the Flickr API.
    function displayImages1(data) {
      //Loop through the results in the JSON array of data. The 'data.photos.photo' bit is what you are trying to 'get at'. i.e. this loop looks at each photo in turn.
      var photoURL;
      // element in infowindow unique to this marker to append images
      var idMatch = ".marker0" + marker.id;
      //Gets the url for each image in recovered JSON.
      $.each(data.photos.photo, function(i,item){


      //only get the first three images
      if(i < 3){
        //construct image tag and source with in li for styling in css
			  photoURL = "<li class'markerLiItem'><img src='" + 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg'+ "' alt=''></li>";
        // append to the dom
        $(idMatch).append(photoURL);
        if(i===2){
          //for last iteration add one more list element including title, street and city for display
           photoURL =  "<li class'markerLiItem'><h3>" + marker.title + "</h3><p>" + marker.street + "</p><p>" + marker.city + "</p></li>";
           $(idMatch).append(photoURL);
         }
       }
			});
    }
  }
return '';
}
