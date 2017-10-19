var Model = function () {
  var self = this;
  self.defaultLocations = [
  {
        "name": "Riddle Room",
        "lat": "43.665756",
        "lng": "-79.384705",
        "address":  '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">Riddle Room</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address : </b>579 Yonge Street</div>'+
              '</div>'
      },
      {
        "name": "La Bella Managua",
        "lat": "43.662247",
        "lng": "-79.424958",
        "address": '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">Maggie Daley Park</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address : </b>872 Bloor St W</div>'+
              '</div>'
      },
      {
        "name": "Richmond Station",
        "lat": "43.651373",
        "lng": "-79.379285",
        "address": '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">Richmond Station</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address : </b>1 Richmond St W</div>'+
              '</div>'
      },
      {
        "name": "Under The Table Restaurant",
        "lat": "43.667423",
        "lng": "-79.369456",
        "address": '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">Under The Table Restaurant</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address : </b>568 Parliament St</div>'+
              '</div>'
      },
      {
        "name": "Katsuya",
        "lat": "43.660047",
        "lng": "-79.369456",
        "address": '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">Katsuya</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address : </b>6048 Yonge St</div>'+
              '</div>'
      },
      {
        "name": "Black Briik Restobar",
        "lat": "43.658982",
        "lng": "-79.348083",
        "address": '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class=Black Briik Restobar</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address : </b>747 Queen St E</div>'+
              '</div>'
        
      }
  ];
  
};

// Declaring global variables

var model = new Model();
var loc = model.defaultLocations;
var marker;
var map;
var infowindow;

var namesInListArr = [];
var namesInListArrCopy = [];
var latArr = [];
var lngArr = [];
var contentInfoArr = [];
var markers = [];
var infowindows = [];

var Client_id = "K0MACLRGBFZ0W1PJHT503EWFRU1APKMXPBWBPG5GQWJ1HJPI";
var Client_secret = "CRHF4PIIHO5IWW1AWLZOMS1EYMET1GP04GSUBYLJJSCMCVFZ";
var foursquareUrlFirst = 'https://api.foursquare.com/v2/venues/search?categoryId=4d4b7105d754a06374d81259&ll=43.653226,-79.383184&limit=15&radius=600'+ '&client_id='+ Client_id + '&client_secret='+ Client_secret + '&v=20151207';


//-------------------------------------------------------------
// Load data from JSON into respective arrays
//-------------------------------------------------------------
var defaultList = function(loc) {
    var i = 0;
    
    for(i = 0; i < loc.length; i++) {
      namesInListArr.push(loc[i].name);
      latArr.push(loc[i].lat);
      lngArr.push(loc[i].lng);
      contentInfoArr.push(loc[i].address);
    }
    
  };

//-------------------------------------------------------------
// Only 6 default locations are provided rest of the locations 
// and their info is loaded from FourSquare API
//-------------------------------------------------------------

var getFoursquareList = function(){
    
  $.getJSON(foursquareUrlFirst).done(function(data) {
       $.each(data.response.venues, function(i,venues){
      var flg = 1;
      for(i=0; i < namesInListArr.length; i++)
        {
          // Using If - Else to check whether the place name fetched by foursquare
          // does not exist in deafult locations list
          // This prevents from having duplicate places
          
          if(venues.name.toLowerCase() == namesInListArr[i].toLowerCase())
          {
            flg = 2;
          //  print("here");
          }
        }
      if( flg == 1)
      {

        var locJSON =  '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">'+ venues.name + '</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Address : </b>' + venues.location.address + '</div>'+
        '</div>';

          namesInListArr.push(venues.name);
          latArr.push(venues.location.lat.toString());
          lngArr.push(venues.location.lng.toString());
          contentInfoArr.push(locJSON);
          namesInListArrCopy.push(venues.name);
      }
    });

      // Due to the reason that default list items were only being displayed 
      // as data from foursquare was being loaded at the end even after using
      // document ready, calling viewmodel at this point works best in my case

      ViewModel();
      initMap();
      createMarkers(namesInListArr);
      createInfowindows(namesInListArr);
      ko.applyBindings(new ViewModel());
      
      })
      .fail(function(error){
        alert("failed to load page because of error : " + error.status);
        console.log(error);
      });

  };
  
// Print functions for debugging

var printArr = function(data) {
  var t = 0;
  for(t = 0; t < data.length; t++)
  {
    console.log(data[t]);
  }
  
};

//var print = function(data) {
//    console.log(data);
//}
  
  

//-------------------------------------------------------------
//  To apply bindings set name of location as name
//-------------------------------------------------------------

var koLocationEntry = function(data) {
    this.name = data;
  };


//-------------------------------------------------------------
//  View Model code
//-------------------------------------------------------------

var ViewModel  = function() {
  var self = this;
  var i;
  //---------------------------------------------------------------------
  // view model varibles
  //---------------------------------------------------------------------
  self.defaultListItems = [];
  self.query = ko.observable('');

  
  
  for(i = 0; i < namesInListArr.length; i++) {
      {
        self.defaultListItems.push(new koLocationEntry(namesInListArr[i]));
      }
  }
  
  self.defaultKoList = ko.observableArray(self.defaultListItems);

  
  //---------------------------------------------------------------------
  // search functionality
  //---------------------------------------------------------------------  
  self.search = function() { 
    var str = "this is in search";
    var data = self.query().toLowerCase();
    //print(str);
    //print (data);
    self.defaultKoList.removeAll();

    for(i = 0; i < namesInListArr.length; i++) {
      if(namesInListArr[i].toLowerCase().indexOf(data) >= 0)
      {
        self.defaultKoList.push(new koLocationEntry(namesInListArr[i]));
        markers[i].setVisible(true);
      }
      else
      {
          markers[i].setVisible(false);
      }
      
    }
   };

  //---------------------------------------------------------------------
  // Action for selecting place from the list : 
  // opens the infowindow and marker bounces of the clicked place 
  //---------------------------------------------------------------------
  
   self.listClickAction = function(data) {
      
      var itemAt = data.name;
      //print(itemAt);
      for(i = 0; i < namesInListArr.length; i++) {
        if ( itemAt.toLowerCase() == namesInListArr[i].toLowerCase())
        {
          toggleBounce( markers[i]);
          var infowindow = new google.maps.InfoWindow({
            content: contentInfoArr[i]
          });
          infowindow.open(map, markers[i]);
          setTimeout(3500);
        }
     }

  };
};

//---------------------------------------------------------------------
// create places map markers
//---------------------------------------------------------------------

function createMarkers(listArr) {
    
  var i;

    for (i = 0; i < listArr.length; i++) {  
    //console.log(namesInListArr[i]);
    
      marker = new google.maps.Marker({
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: {lat: parseFloat(latArr[i]), lng: parseFloat(lngArr[i])}
      
    });
    markers.push(marker);



  }
}


//---------------------------------------------------------------------
// create places infowindows
//---------------------------------------------------------------------
    
function createInfowindows(listArr) {

 for (i = 0; i < listArr.length; i++) {
  var marker = markers[i];
  google.maps.event.addListener(marker, 'click', (function(marker, i) {
     return function() {
    
        toggleBounce(marker);
        infowindow.setContent(contentInfoArr[i]);
        infowindows.push(infowindow);
        infowindow.open(map, marker);
        setTimeout(function(){ infowindow.close(); }, 3500);
       };
    })(marker, i));
  }
  }


//---------------------------------------------------------------------
// animate markers
//---------------------------------------------------------------------

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 3500);
  }
}

//-------------------------------------------------------------
// Initialize Map
//-------------------------------------------------------------

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: parseFloat(latArr[0]), lng: parseFloat(lngArr[0])}
  });
  infowindow = new google.maps.InfoWindow();
}

function googleError() {
  alert("failed to load page ");
}

$(document).ready(function() {
  defaultList(loc);
});

$(document).ready(function() {
  getFoursquareList();

});


// var map;

// var markers = [];
//       function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: 43.7, lng: -79.4},
//           zoom: 8,
//           gestureHandling: 'greedy'
//         });

//         var locations = [
//         {title: "Pancer's Original Deli", location: {lat:43.740807, lng:-79.435246}},
//         {title: 'La Bella Managua', location: {lat: 43.662247, lng:-79.424958 }},
//         {title: 'Richmond Station', location: {lat: 43.651373, lng:-79.379285 }},
//         {title: 'Under The Table Restaurant', location: {lat: 43.667423, lng: -79.369456  }},
//         {title: 'Katsuya', location: {lat: 43.660047, lng:-79.378802}},
//         {title: 'Black Briik Restobar', location:  {lat:43.660093, lng:-79.433137 }},
//         {title: "I'll be Seeing You", location: {lat: 43.658982, lng:-79.348083 }},
//         ];

//         var largeInfowindow = new google.maps.InfoWindow();
//         var bounds = new google.maps.LatLngBounds();

//         for(var i=0; i < locations.length; i++){
//           var position = locations[i].location;
//           var title = locations[i].title;

//           var marker = new google.maps.Marker({
//             map: map, 
//             position: position,
//             title: title,
//             animation: google.maps.Animation.DROP,
//             id: i
//           });
//           markers.push(marker);
//           bounds.extend(marker.position);

//           marker.addListener('click', function(){
//             populateInfoWindow(this, largeInfowindow)
//           });
//         }
//          //This autocomplete is for use in the geocoder entry box.
//         var zoomAutocomplete = new google.maps.places.Autocomplete(
//           document.getElementById('zoom-to-area-text'));
//         //Bias the boundaries within the map for the zoom to area text. 
//         zoomAutocomplete.bindTo('bounds', map);

//         document.getElementById('zoom-to-area').addEventListener('click', function() {
//           zoomToArea();
//         });
//         map.fitBounds(bounds);

        
//         function populateInfoWindow(marker, infowindow) {
//         // Check to make sure the infowindow is not already opened on this marker.
//         if (infowindow.marker != marker) {
//           // Clear the infowindow content to give the streetview time to load.
//           infowindow.setContent('');
//           infowindow.marker = marker;
//           // Make sure the marker property is cleared if the infowindow is closed.
//           infowindow.addListener('closeclick', function() {
//             infowindow.marker = null;
//           });
          
//           // In case the status is OK, which means the pano was found, compute the
//           // position of the streetview image, then calculate the heading, then get a
//           // panorama from that and set the options
          
//           var streetViewService = new google.maps.StreetViewService();
//           var radius = 50;
//           function getStreetView(data, status) {
//             if (status == google.maps.StreetViewStatus.OK) {
//               var nearStreetViewLocation = data.location.latLng;
//               var heading = google.maps.geometry.spherical.computeHeading(
//                 nearStreetViewLocation, marker.position);
//                 infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
//                 var panoramaOptions = {
//                   position: nearStreetViewLocation,
//                   pov: {
//                     heading: heading,
//                     pitch: 30
//                   }
//                 };
//               var panorama = new google.maps.StreetViewPanorama(
//                 document.getElementById('pano'), panoramaOptions);
//             } else {
//               infowindow.setContent('<div>' + marker.title + '</div>' +
//                 '<div>No Street View Found</div>');
//             }
//           }
//           // Use streetview service to get the closest streetview image within
//           // 50 meters of the markers position
//           streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
//           // Open the infowindow on the correct marker.
//           infowindow.open(map, marker);
//         }
//       }
//         function zoomToArea() {
//         // Initialize the geocoder.
//         var geocoder = new google.maps.Geocoder();
//         // Get the address or place that the user entered.
//         var address = document.getElementById('zoom-to-area-text').value;
//         // Make sure the address isn't blank.
//         if (address == '') {
//           window.alert('You must enter an area, or address.');
//         } else {
//           // Geocode the address/area entered to get the center. Then, center the map
//           // on it and zoom in
//           geocoder.geocode(
//             { address: address,
//               componentRestrictions: {locality: 'Toronto'}
//             }, function(results, status) {
//               if (status == google.maps.GeocoderStatus.OK) {
//                 map.setCenter(results[0].geometry.location);
//                 map.setZoom(15);
//               } else {
//                 window.alert('We could not find that location - try entering a more' +
//                     ' specific place.');
//               }
//             });
//       }
//     }
//   }