
function googleError(){
  console.log("Google Maps Failed To Load!");
}

var map,
infowindow; // make infowindow a global variable

// Create a new blank array for all the listing markers.
var markers = [];
var query = ko.observable(""); //element typed into  input

function Model() {
    var galleryMarkers = [{
        title: "National Gallery London",
        location: {
            lat: 51.508926,
            lng: -0.128285
        },
        streetAddress: "Trafalgar Square",
        cityAddress: "London, WC2N 5DN",
        id: "nav0",
        visible: true,
        isMarker: true
    }, {
        title: "National Portrait Gallery",
        location: {
            lat: 51.509422,
            lng: -0.128122
        },
        streetAddress: "St. Martin's Pl",
        cityAddress: "London WC2H 0HE",
        id: "nav0",
        visible: true,
        isMarker: true
    }, {
        title: "Tate Modern",
        location: {
            lat: 51.507594,
            lng: -0.099357
        },
        streetAddress: "Bankside",
        cityAddress: "London SE1 9TG",
        id: "nav0",
        visible: true,
        isMarker: true
    }, {
        title: "Saatchi Gallery",
        location: {
            lat: 51.490696,
            lng: -0.158716
        },
        streetAddress: "Duke Of York's HQ, King's Rd",
        cityAddress: "London SW3 4RY",
        id: "nav0",
        visible: true,
        isMarker: true
    }, {
        title: "Natural History Museum",
        location: {
            lat: 51.496714,
            lng: -0.176372
        },
        streetAddress: "Cromwell Rd",
        cityAddress: "London SW7 5BD",
        id: "nav0",
        visible: true,
        isMarker: true
    }, {
        title: "Tate Britain",
        location: {
            lat: 51.491062,
            lng: -0.127788
        },
        streetAddress: "Millbank, Westminster",
        cityAddress: "London SW1P 4RG",
        id: "nav0",
        visible: true,
        isMarker: true
    }];

    return galleryMarkers;
}

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.508926,
            lng: -0.128285
        },
        zoom: 13
    });
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = Model();
    infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var streetAddress = locations[i].streetAddress;
        var cityAddress = locations[i].cityAddress;
        var visibility = locations[i].visible;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            visible: visibility,
            id: i
        });
        // Push the marker to our array of markers.
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this);
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




    var markerLoad = function(data) {
        //bount to sidebar links giving access to marker behaviour
        this.position = ko.observable(data.position);
        this.title = ko.observable(data.title);
        this.visibility = ko.observable(data.visible);
        this.clickable = function() {
            //open info window when clicked
            populateInfoWindow(data);
            //bounce animation when clicked
            toggleBounce(data);
        };
    };

    var ViewModel = function() {
        var self = this;
        //creates array to search through and compare with input
        this.recenter = function() {
          $('.recenter').css('display', 'none');
          return map.fitBounds(bounds);
        }

        function ultimateList() {
            console.log();
            var clickableArray = [];
            for (var i = 0; i < markers.length; i++) {
                clickableArray[i] = new markerLoad(markers[i]);
            }
            return clickableArray;
        }
        this.setMarker = function(clickedMarker) {
            clickedMarker.clickable(); //when side bar link is clicked open infowindow for selected location
        };
        this.searchResults = ko.computed(function() {
            var q = query(); // typed into input to be compared
            return ultimateList().filter(function(i) {
                return i.title().toLowerCase().indexOf(q) >= 0; //compare all location in array with input only return matching
            });
        });

        this.searchMarkers = ko.computed(function() {
            var q = query(); // typed into input to be compared

            return markers.filter(function(i) {
                if (i.title.toLowerCase().indexOf(q) !== 0) {
                    i.setMap(null);
                } else {
                    i.setMap(map);
                }
                return i.title.toLowerCase().indexOf(q) >= 0; //compare all location in array with input only return matching
            });
        });
    };

    ko.applyBindings(new ViewModel());

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        getFlickerImage(marker);
        infowindow.setContent(
          "<li class'markerLiItem'><h3>" + marker.title + "</h3><p>" + marker.street + "</p><p>" + marker.city + "</p></li></div>"
        );
        map.setZoom(15);
        map.setCenter(marker.getPosition());
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            marker.setAnimation(null); // stop bounce when infowindow is closed
            infowindow.marker = (null);
        });
        $('.recenter').css('display', 'block');
    }
}

function toggleBounce(marker) {
    //stop all other bounces
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
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
    var myVariable;
    searchFlickr(getURL);

    function modURL(modMarker) { //Modify URL for spcific marker
        var searchText = modMarker.title;
        //replace spaces with "+" to make it URL friendly
        searchText = searchText.replace(/\s+/g, '+');
        var URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=fd46fabfe3102f771ee0e03a437febf4&text=" + searchText + "&page=1&format=json&jsoncallback=?";
        //var URL = "www.testingmy/json.com"
        return URL;
    }
    var imageDataConstructor = function(data) {
      //bount to sidebar links giving access to marker behaviour
      this.farm = data.farm;
      this.server = data.server;
      this.id = data.id;
      this.secret = data.secret;
    };
    var sendItOutConstructor = function(data) {
      //bount to sidebar links giving access to marker behaviour
      this.myObject = data;

    };

    function searchFlickr(url) { //accessing flicker API
        //This function actually does something with the data after it has been read in from the Flickr API.

      jqXHR = $.getJSON(url, displayImages1).done(function() {
          console.log('getJSON request succeeded!');
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
          console.log('getJSON request failed! ' + textStatus);

      })
      .always(function() {
          console.log('getJSON request ended!');

      });

      function displayImages1(rawData) {

        infowindow.setContent(
          //define infowindow here because code runs asyncronously
          '<div class="markers marker0' + marker.id + '">' +
          "<li class'markerLiItem'><img src='" + 'http://farm' + rawData.photos.photo[0].farm + '.static.flickr.com/' + rawData.photos.photo[0].server + '/' + rawData.photos.photo[0].id + '_' + rawData.photos.photo[0].secret + '_m.jpg' + "' alt=''></li>" +
          "<li class'markerLiItem'><img src='" + 'http://farm' + rawData.photos.photo[1].farm + '.static.flickr.com/' + rawData.photos.photo[1].server + '/' + rawData.photos.photo[1].id + '_' + rawData.photos.photo[1].secret + '_m.jpg' + "' alt=''></li>" +
          "<li class'markerLiItem'><img src='" + 'http://farm' + rawData.photos.photo[2].farm + '.static.flickr.com/' + rawData.photos.photo[2].server + '/' + rawData.photos.photo[2].id + '_' + rawData.photos.photo[2].secret + '_m.jpg' + "' alt=''></li>" +
          "<li class'markerLiItem'><h3>" + marker.title + "</h3><p>" + marker.street + "</p><p>" + marker.city + "</p></li></div>"
        );
      }

    }
}
