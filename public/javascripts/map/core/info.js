const infoLatLng = L.control({ position: 'bottomleft' })
infoLatLng.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend')
  div.innerHTML += '<div>ZOOM LEVEL : <span id="zoomLevel"></span></div>'
  div.innerHTML += '<div class="coord"><span class="latlng"></span></div>'
  return div
}
infoLatLng.addTo(map)
$('#zoomLevel').text(map.getZoom())
