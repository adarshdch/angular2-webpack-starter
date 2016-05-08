import {Component} from '@angular/core';
import {DonorRegistration} from '../donor-registration';
import { MODAL_DIRECTIVES } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Donor }    from '../donor';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {AppState} from '../app.service';

@Component({
  selector: 'gmap',
  template: require('./gmap.html'),
  directives: [MODAL_DIRECTIVES, DonorRegistration],
  styles: [`
    h1 {
      font-family: Arial, Helvetica, sans-serif
    }
    md-card{
      margin: 25px;
    }
  `]
})

export class Gmap {
  constructor(private http: Http, public appState: AppState) {
  }

  donorMap = {};
  donorMarker = null;
  donorInfo = null;
  allMarkers = [];
  model = [];
  mapProperties = {
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };


  //this.Map = new google.maps.Map(document.getElementById("googleMap"), this.mapProperties);
  ngOnInit() {
    this.initMap();
    this.setUserLocation();
    //this.renderGmap();
    this.setDonorLocations();
  }

  asyncDataWithWebpack() {
    // you can also async load mock data with 'es6-promise-loader'
    // you would do this if you don't want the mock-data bundled
    // remember that 'es6-promise-loader' is a promise
    // var asyncMockDataPromiseFactory = require('es6-promise!assets/mock-data/mock-data.json');
    // setTimeout(() => {
    //
    //   let asyncDataPromise = asyncMockDataPromiseFactory();
    //   asyncDataPromise.then(json => {
    //     console.log('async mockData', json);
    //   });
    //
    // });
  }


  renderGmap() {
    return;
    var that = this;
    this.donorMap = new google.maps.Map(document.getElementById("googleMap"), this.mapProperties);
    //Handle click event on map
    google.maps.event.addListener(this.donorMap, 'click', function(e) {
      //that.donorMap.setZoom(9);
      console.log('clicked: ');
      console.log(e);
      //that.donorMap.setCenter(currentMarker.getPosition());
      $('.modal').modal('toggle');
    });

    //var infoWindow = new google.maps.InfoWindow({ map: map });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(currentPosition) {
        let curLatLang = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
        that.appState.set('userCoordinate', curLatLang);

        let currentMarker = new google.maps.Marker({
           position: curLatLang
        });
        //Create marker for user's location
        currentMarker.setMap(that.donorMap);
        //Center to user's position
        that.donorMap.setCenter(curLatLang);
        console.log(curLatLang);

        //infoWindow.setPosition(position);
        //infoWindow.setContent('Your current location.');
        //infoWindow.open(map, marker);
        google.maps.event.addListener(currentMarker, 'click', function() {
          //that.donorMap.setZoom(9);
          that.donorMap.setCenter(currentMarker.getPosition());
          $('.modal').modal('toggle');
        });

        , function() {
          //this.handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    }
    else {
          // Browser doesn't support Geolocation
          //this.handleLocationError(false, infoWindow, map.getCenter());
    }

  }


  setUserLocation(){
    let that = this;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(currentPosition) {
      that.addMarker({ lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude }, true);

        //let curLatLang = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
        //that.appState.set('userCoordinate', curLatLang);

        //let currentMarker = new google.maps.Marker({
          //position: curLatLang
        //});
        //Create marker for user's location
        //currentMarker.setMap(that.donorMap);
        //Center to user's position
        //that.donorMap.setCenter(curLatLang);
        //console.log(curLatLang);

        //infoWindow.setPosition(position);
        //infoWindow.setContent('Your current location.');
        //infoWindow.open(map, marker);


        , function() {
          //this.handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    }
    else {
          // Browser doesn't support Geolocation
          //this.handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  setDonorLocations(){
    let that = this;
    //Create marker for donors
    this.http.get('http://localhost:3010/api/donors')
      .map(res => res.json())
      .subscribe(donors => {
        for (let index = 0; index < donors.length; index++) {
          that.addMarker({ lat: donors[index].location.lat, lng: donors[index].location.long});
        }
      });
  }

  initMap(){
    let that = this;
    var haightAshbury = { lat: 37.769, lng: -122.446 };

    this.donorMap = new google.maps.Map(document.getElementById('googleMap'), {
      zoom: 12,
      center: haightAshbury
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // This event listener will call addMarker() when the map is clicked.
    this.donorMap.addListener('click', function(event) {
      that.addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() }, true);
    });

    // Adds a marker at the center of the map.
    this.addMarker(haightAshbury, true);
  }

  // Adds a marker to the map and push to the array.
  addMarker(location, isDonorLocation) {
    let that = this;
    var marker = new google.maps.Marker({
      position: location,
      map: that.donorMap
    });

    if(isDonorLocation){
      this.removeMarker(this.donorMarker);
      this.donorMarker = marker;
      
      that.appState.set('userCoordinate', location);
      
      google.maps.event.addListener(marker, 'click', function() {
          $('.modal').modal('toggle');
        });
      
    }
    else{
      this.allMarkers.push(marker);
    }

    this.locateMarker(marker);
  }

  getMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: this.donorMap
    });
    return marker;
  }

  // Remove a marker from the map
  removeMarker(marker){
    if(marker){
      marker.setMap(null);
    }
  }

  locateMarker(marker){
    this.donorMap.setCenter(marker.getPosition());
  }

  // Sets the map on all markers in the array.
  setMapOnAll(map) {
    for (var i = 0; i < this.allMarkers.length; i++) {
      this.allMarkers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll(null);
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //alert('error');
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

}
