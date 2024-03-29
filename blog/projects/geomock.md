---
project_name: GeoMock
title: Mock the Geolocation API
repository_name: GeoMock
version: 1.0
permalink: projects/geomock.html
type: project
---

## Description <a name="description"></a>

Developing Geo-aware Apps/Games can be such a pain in the ass.

It can take ages until the device finally gets a decent signal or it's raining outside and you don't want to run around out in that bad weather to test your app or maybe you're just too lazy to walk a mile or two ;)

GeoMock can help in many ways when working with the Geolocation API:

- Predefined locations can fire up through the normal Geolocation API after a certain delay or even immediately
- It also allows you to define a set of waypoints that are being propagated through `geolocation.watchPosition`.
- It can be used to test the way your app behaves when no signal could be retrieved

## TOC

- [Usage](#usage)
- [Example](#example)
- [Dependencies](#dependencies)
- [Changelog](#changelog)

## Usage <a name="usage"></a>

Simply include geomock.js in your website and it will replace the native Geolocation object. There is no need to change the API for tests because it mocks the Geolocation API.

To retrieve a location user `navigator.geolocation.getCurrentPosition(success, error)` or `navigator.geolocation.watchPosition(success, error)`.

The mock-locations can be changed by accessing the `navigator.geolocation.waypoints`-Array.

The predefined delay is 1000ms. Change it like this `navigator.geolocation.delay = 2000;`.

To test failing requests, set `navigator.geolocation.shouldFail` to `true`.

## Example <a name="example"></a>

Simple watchPosition() demo (<a href="http://janmonschke.com/GeoMock/example.html">http://janmonschke.com/GeoMock/example.html</a>)

The code for the example:

```js
window.onload = function () {
  // setting up Google Maps
  var latlng = new google.maps.LatLng(
    navigator.geolocation.waypoints[0].coords.latitude,
    navigator.geolocation.waypoints[0].coords.longitude
  );

  var myOptions = {
    zoom: 18,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  var map_elem = document.getElementById("map_canvas");
  map_elem.style.height = window.innerHeight + "px";

  var map = new google.maps.Map(map_elem, myOptions);
  var marker = new google.maps.Marker({ position: latlng });
  marker.setMap(map);

  // GeoMock example code
  navigator.geolocation.shouldFail = false;
  navigator.geolocation.delay = 2000;

  var basicSuccessHandler = function (location) {
    console.log("Received a location:", location);
    latlng = new google.maps.LatLng(
      location.coords.latitude,
      location.coords.longitude
    );
    map.panTo(latlng);
    marker.setPosition(latlng);
  };

  var basicErrorHandler = function (msg) {
    console.log("Geolocation error:", msg);
  };

  navigator.geolocation.watchPosition(basicSuccessHandler, basicErrorHandler);
};
```

## Dependencies <a name="dependencies"></a>

none

## Changelog <a name="changelog"></a>

- **v1.0**
  - initial version
  - multiple waypoints
