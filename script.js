var map = null;
var infoWindows = [];
var markers = [
    {   
    title: "Vivanta By Taj - Whitefield",
    index: 0,
    lat: 12.9867562, 
    lng: 77.7369873,
    address: "Pattandur Agrahara, Whitefield, Bangalore -560066"
    },
    {   
    title: "Brigade Tech Park",
    index: 1,
    lat: 12.9852778, 
    lng: 77.7350714,
    address: "Agrahara, Whitefield, Bangalore -560066"
    },
    {   
    title: "Windmill Craftworks",
    index: 2,
    lat: 12.9812684, 
    lng: 77.7302642,
    address: "Agrahara, Whitefield, Bangalore -560066"
    },
    {   
    title: "ITPL",
    index: 3,
    lat: 12.986517, 
    lng: 77.7350493,
    address: "Agrahara, Whitefield, Bangalore -560066"
    },
    {
    title: "Punjabi By Nature",
    index: 4,
    lat: 12.9876013, 
    lng: 77.7303985,
    address: "KIADB, Whitefield, Bangalore -560066"
    }   
];

var markerObjs = [];

function AppViewModel() {
    var self = this;
 
    self.filter = ko.observable("");
    self.data = ko.observableArray(markers);

    self.filterData = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.data();
        } else {
            return ko.utils.arrayFilter(markers, function(marker) {
                if (marker.title.toLowerCase().indexOf(filter) >= 0) {
                    return marker;
                }
            });
        }
    }, self);

    self.clickMarker = function(){
        google.maps.event.trigger(markerObjs[this.index], 'click');
    }

}
 
ko.applyBindings(new AppViewModel());

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

//Initialize map component
function initMap() {
    var uluru = {lat: 12.986517, lng: 77.7350493};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: uluru
    });   
    intializeMarkers(markers);
}

//Function to initialize markers on Map
function intializeMarkers(markers_) {
	for(var i=0;i<markers_.length;i++) {
		var marker = new google.maps.Marker({
	      position: new google.maps.LatLng(markers_[i].lat, markers_[i].lng),
	      map: map
	    });
		var infowindow = new google.maps.InfoWindow();
		var content = "<b>"+markers_[i].title+"<b><br/>"+markers_[i].address;
		// add an event listener for this marker
		bindInfoWindow(marker, map, infowindow, content);

        markerObjs.push(marker);
	}
}

//Bind InfoWindow
function bindInfoWindow(marker, map, infowindow, html) {
    marker.addListener('click', function() {
        closeAllInfoWindows();
        map.setCenter(marker.getPosition());
        infowindow.setContent(html);
        infowindow.open(map, this);
        infoWindows.push(infowindow);
    });	
}

//Close all infowindows
function closeAllInfoWindows() {
  for (var i=0;i<infoWindows.length;i++) {
     infoWindows[i].close();
  }
}
