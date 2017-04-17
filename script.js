var map = null;
var infoWindows = [];
//For Foursquare
var clientId = "G2FT403HGUUQJYOTQH3CDRMNVUGGLOUSDPP5PC1C5ZIFQ4MU";
var clientSecret = "RDYQ13HYX3LA30RCTLLMAV4JCGENSQBOM0OE0W31MHE355AQ";
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
        var markerIndexList = [];
        if (!filter) {
            for(var i=0; i<markerObjs.length; i++){
                markerObjs[i].setVisible(true);    
            }
            return self.data();
        } else {
            var returnCode = ko.utils.arrayFilter(markers, function(marker) {
                if (marker.title.toLowerCase().indexOf(filter) >= 0) {            
                    markerIndexList.push(marker.index);
                    return marker;
                }
            });

            for(var i=0; i<markerObjs.length; i++){
                if(markerIndexList.indexOf(markers[i].index) >= 0) {
                    markerObjs[i].setVisible(true);   
                }
                else 
                    markerObjs[i].setVisible(false);    
            }

            return returnCode;
        }
        
    }, self);

    self.clickMarker = function(){
        google.maps.event.trigger(markerObjs[this.index], 'click');
    };

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
          animation: google.maps.Animation.DROP,
	      map: map
	    });
		var infowindow = new google.maps.InfoWindow();
		var content = "<b>"+markers_[i].title+"<b><br/>"+markers_[i].address;
        bindInfoWindow(marker, map, infowindow, content, i);
        markerObjs.push(marker);
	}
}

//Bind InfoWindow
function bindInfoWindow(marker, map, infowindow, html, index) {
    marker.addListener('click', function() {
        var content = html;
        closeAllInfoWindows();
        removeAllAnimations();
        map.setCenter(marker.getPosition());
        toggleBounce(marker);

        //Get Phone number using Foursquare API
        var fs_url = "https://api.foursquare.com/v2/venues/search?ll="+markers[index].lat+","+markers[index].lng+"&client_id="+clientId+"&client_secret="+clientSecret+"&v=20170404&query="+markers[index].title;
        $.getJSON(fs_url)
            .done(function(response){
                content = content + "<br/>";
                if(response.response.venues[0].contact.phone != undefined)
                    content = content + "Call: "+response.response.venues[0].contact.phone;
                else content = content + "Call: Not available";
                infowindow.setContent(content);
            })
            .fail(function(){
                content = content + "<br/>" + "Contact details not available at this time";               
            });

        infowindow.open(map, this);
        infoWindows.push(infowindow);
    });	
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

//Close all infowindows
function removeAllAnimations() {
  for (var i=0;i<infoWindows.length;i++) {
     infoWindows[i].close();
  }
}

//Remove all animations
function closeAllInfoWindows() {
  for (var i=0;i<markerObjs.length;i++) {
     markerObjs[i].setAnimation(null);
  }
}

/**
 * Error callback for GMap API request
 */
function mapError() {
  console.log("Error loading Map API");
}