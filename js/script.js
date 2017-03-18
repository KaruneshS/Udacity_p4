var map;
var markersArray = [];

//Information about the different locations
//Provides information for the markers
var markers = [
    {   
    title: "Vivanta By Taj - Whitefield",
    lat: 12.9867562, 
    lng: 77.7369873,
    streetAddress: "Pattandur Agrahara, Whitefield",
    cityAddress: "Bangalore, 560066",
    id: "nav0",
    visible: ko.observable(true),
    boolTest: true
    },
    {   
    title: "Brigade Tech Park",
    lat: 12.9852778, 
    lng: 77.7350714,
    streetAddress: "Agrahara, Whitefield",
    cityAddress: "Bangalore, 560066",
    id: "nav1",
    visible: ko.observable(true),
    boolTest: true
    },
    {   
    title: "Windmill Craftworks",
    lat: 12.9812684, 
    lng: 77.7302642,
    streetAddress: "Agrahara, Whitefield",
    cityAddress: "Bangalore, 560066",
    id: "nav2",
    visible: ko.observable(true),
    boolTest: true
    },
    {   
    title: "ITPL",
    lat: 12.986517, 
    lng: 77.7350493,
    streetAddress: "Agrahara, Whitefield",
    cityAddress: "Bangalore, 560066",
    id: "nav3",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "Punjabi By Nature",
    lat: 12.9876013, 
    lng: 77.7303985,
    streetAddress: "KIADB, Whitefield",
    cityAddress: "Bangalore, 560066",
    id: "nav4",
    visible: ko.observable(true),
    boolTest: true
    }   
];

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=false&callback=initialize';
  document.body.appendChild(script);
}
window.onload = loadScript;

//Initialize the map and its contents
function initialize() {  
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(12.986517, 77.7350493),
        mapTypeControl: false,
        disableDefaultUI: true
    };
    if($(window).width() <= 1080) {
        mapOptions.zoom = 13;
    }
    if ($(window).width() < 850 || $(window).height() < 595) {
        hideNav();
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  

    setMarkers(markers);

    setAllMap();

    //Reset map on click handler and
    //when window resize conditionals are met
    function resetMap() {
        var windowWidth = $(window).width();
        if(windowWidth <= 1080) {
            map.setZoom(13);
            map.setCenter(mapOptions.center);
        } else if(windowWidth > 1080) {
            map.setZoom(14);
            map.setCenter(mapOptions.center);   
        }
    }
    $("#reset").click(function() {
        resetMap();
    });
   $(window).resize(function() {
        resetMap();
    }); 
}

//Determines if markers should be visible
//This function is passed in the knockout viewModel function
function setAllMap() {
  for (var i = 0; i < markers.length; i++) {
    if(markers[i].boolTest === true) {
    markers[i].holdMarker.setMap(map);
    } else {
    markers[i].holdMarker.setMap(null);
    }
  }
}

//Get Google Street View Image for each inidividual marker
    //Passed lat and lng to get each image location
    //Had to pass title for whitehouse & different lat and lng to get images
    //for White House and Capitol
var headingImageView = [5, 235, 55, 170, 190, 240, -10, 10, 190];     
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

function determineImage() {
    if (i === 3) {
        streetViewImage = streetViewUrl + '38.892052,-77.008888&fov=75&heading=' + headingImageView[i] + '&pitch=10';                 
    } else if (i === 4) {
        streetViewImage = streetViewUrl +
                        markers[i].streetAddress + ',' + markers[i].cityAddress +
                        '&fov=75&heading=' + headingImageView[i] + '&pitch=10';
    } else {
       streetViewImage = streetViewUrl +
                        markers[i].lat + ',' + markers[i].lng +
                        '&fov=75&heading=' + headingImageView[i] + '&pitch=10'; 
                    }                   
}

//Sets the markers on the map within the initialize function
    //Sets the infoWindows to each individual marker
    //The markers are inidividually set using a for loop
function setMarkers(location) {
    
    for(i=0; i<location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
          position: new google.maps.LatLng(location[i].lat, location[i].lng),
          map: map,
          title: location[i].title,
          icon: {
            url: 'img/marker.png',
            size: new google.maps.Size(25, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            },
          shape: {
            coords: [1,25,-40,-25,1],
            type: 'poly'
          }  
        });

        //function to place google street view images within info windows
        determineImage();

        //Binds infoWindow content to each marker
        location[i].contentString = '<img src="' + streetViewImage + 
                                    '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' + 
                                    location[i].title + '</strong><br><p>' + 
                                    location[i].streetAddress + '<br>' + 
                                    location[i].cityAddress;

        var infowindow = new google.maps.InfoWindow({
            content: markers[i].contentString
        });

        //Click marker to view infoWindow
            //zoom in and center location on click
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map,this);
            var windowWidth = $(window).width();
            if(windowWidth <= 1080) {
                map.setZoom(14);
            } else if(windowWidth > 1080) {
                map.setZoom(16);  
            }
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
          }; 
        })(location[i].holdMarker, i));
        
        //Click nav element to view infoWindow
            //zoom in and center location on click
        var searchNav = $('#nav' + i);
        searchNav.click((function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map,marker);
            map.setZoom(16);
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
          }; 
        })(location[i].holdMarker, i));
    }
}

//Query through the different locations from nav bar with knockout.js
    //only display markers and nav elements that match query result
var viewModel = {
    query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function(marker) {
    if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
        } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
        }
    });       
}, viewModel);

ko.applyBindings(viewModel);

//show $ hide markers in sync with nav
$("#input").keyup(function() {
setAllMap();
});