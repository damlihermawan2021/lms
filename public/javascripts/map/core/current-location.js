var currentPos, accuracy

function onLocationFound (e) {
  if (currentPos) {
    map.removeLayer(currentPos)
    map.removeLayer(accuracy)
  }
  var radius = e.accuracy / 2
  currentPos = L.marker(e.latlng).addTo(map)
    .bindPopup('Current location is within ' + radius + ' meters').openPopup()
  accuracy = L.circle(e.latlng, radius).addTo(map)
}

function onLocationError (e) {
  iziToast.error({
    title: 'Ups!',
    message: e.message,
    timeout: 3000
  })
}

function searchMyLocation () {
  map.locate({
    setView: true,
    maxZoom: 17
  })
}

map.on('locationfound', onLocationFound)
map.on('locationerror', onLocationError)
