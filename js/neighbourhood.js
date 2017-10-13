var map;

var markers = [];
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 43.7, lng: -79.4},
          zoom: 8,
          gestureHandling: 'greedy'
        });

        var locations = [
        {title: "Pancer's Original Deli", location: {lat:43.740807, lng:-79.435246}},
        {title: 'La Bella Managua', location: {lat: 43.662247, lng:-79.424958 }},
        {title: 'Richmond Station', location: {lat: 43.651373, lng:-79.379285 }},
        {title: 'Under The Table Restaurant', location: {lat: 43.667423, lng: -79.369456  }},
        {title: 'Katsuya', location: {lat: 43.660047, lng:-79.378802}},
        {title: 'Black Briik Restobar', location:  {lat:43.660093, lng:-79.433137 }},
        {title: "I'll be Seeing You", location: {lat: 43.658982, lng:-79.348083 }},
        ];

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        for(var i=0; i < locations.length; i++){
          var position = locations[i].location;
          var title = locations[i].title;

          var marker = new google.maps.Marker({
            map: map, 
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          markers.push(marker);
          bounds.extend(marker.position);

          marker.addListener('click', function(){
            populateInfoWindow(this, largeInfowindow)
          });
        }
         //This autocomplete is for use in the geocoder entry box.
        var zoomAutocomplete = new google.maps.places.Autocomplete(
          document.getElementById('zoom-to-area-text'));
        //Bias the boundaries within the map for the zoom to area text. 
        zoomAutocomplete.bindTo('bounds', map);

        document.getElementById('zoom-to-area').addEventListener('click', function() {
          zoomToArea();
        });
        map.fitBounds(bounds);

        
        function populateInfoWindow(marker, infoWindow){

          if(infoWindow.marker != marker){
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);

            infoWindow.addListener('closeclick', function(){
              infoWindow.setMarker(null);
            });

          }
        }
        function zoomToArea() {
        // Initialize the geocoder.
        var geocoder = new google.maps.Geocoder();
        // Get the address or place that the user entered.
        var address = document.getElementById('zoom-to-area-text').value;
        // Make sure the address isn't blank.
        if (address == '') {
          window.alert('You must enter an area, or address.');
        } else {
          // Geocode the address/area entered to get the center. Then, center the map
          // on it and zoom in
          geocoder.geocode(
            { address: address,
              componentRestrictions: {locality: 'Toronto'}
            }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
              } else {
                window.alert('We could not find that location - try entering a more' +
                    ' specific place.');
              }
            });
      }
    }
  }