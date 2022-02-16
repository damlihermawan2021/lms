const geoCoder = L.Control.geocoder({
  geocoder: new L.Control.Geocoder.Nominatim(),
  // geocoder: new L.Control.Geocoder.arcgis(),
  // geocoder: new L.Control.Geocoder.google('AIzaSyBgPP-TEQ9RzWqSROWxFz73-2LvrKPhSg0'),
  collapsed: false,
  expand: 'hover',
  defaultMarkGeocode: false,
  placeholder: 'Search places...',
  errorMessage: '',
  showResultIcons: true,
  suggestMinLength: 2,
  suggestTimeout: 50,
  queryMinLength: 2
})
  .on('markgeocode', function (e) {
    const latlngx = [
      e.geocode.center.lat,
      e.geocode.center.lng
    ]
    L.marker(latlngx).addTo(map)
    map.setView(latlngx, 14)
  })

geoCoder.setPosition('topright').addTo(map)
