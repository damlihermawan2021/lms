const currentLocation = L.easyButton('<i class="crosshairs icon" title="Show current location"/>',() => searchMyLocation())
const zoomin = L.easyButton('<i class="plus icon" title="Zoom In"/>', () => map.zoomIn())
const zoomout = L.easyButton('<i class="minus icon" title="Zoom Out"/>', () => map.zoomOut())
L.easyBar([currentLocation, zoomin, zoomout]).setPosition('topleft').addTo(map)

// configure and add geoman controls
map.pm.setPathOptions({
  color: 'red',
  fillColor: 'salmon',
  fillOpacity: 0.2
})
map.pm.addControls({
  cutPolygon: false, // adds button to cut a hole in a polygon
  deleteLayer: false,
  dragMode: false,
  drawCircle: false, // adds button to draw a cricle
  drawCircleMarker: false,
  drawMarker: true, // adds button to draw markers
  drawPolygon: true, // adds button to draw a polygon
  drawPolyline: false, // adds button to draw a polyline
  drawRectangle: false, // adds button to draw a rectangle
  editMode: false, // adds button to toggle edit mode for all layers
  editPolygon: false,
  position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
  removalMode: false, // adds a button to remove layers
  useFontAwesome: false // use fontawesome instead of geomanIcons (you need to include fontawesome yourself)
})
map.pm.disableGlobalEditMode()

const clearLayer = L.easyButton('<i class="eraser icon" title="Clear drawing layer"/>',
  function () {
    mapConfig.drawLayer.clearLayers()
  })
const tlbar = L.easyBar([clearLayer])
tlbar.setPosition('topleft')
tlbar.addTo(map)


// add scale bar
L.edgeScaleBar().addTo(map)

var boundlong1 = map.getBounds()._southWest.lng,
boundlat1 = map.getBounds()._southWest.lat,
boundlong2 = map.getBounds()._northEast.lng,
boundlat2 = map.getBounds()._northEast.lat;
var bboxWKT = "POLYGON((" + boundlong1 + " " + boundlat1 + "," + boundlong1 + " " + boundlat2 +
"," + boundlong2 + " " + boundlat2 + "," + boundlong2 + " " + boundlat1 + "," + boundlong1 + " " + boundlat1 + "))";


// build context menu
for (const key of Object.keys(mapConfig.layers)) {
  map.contextmenu.addItem({
    text: 'Load ' + mapConfig.layers[key].label,
    callback: function () {
      mapFunc.requestData(`${mapConfig.loadDataRoute}/${key}`, {
        method: 'GET',
        data: {
          bbox: map.getBounds().toBBoxString(),
          bboxWKT: bboxWKT,
          zoom: map.getZoom()
        }
      }, function (resp) {
        mapLayers[key].clearLayers()
        mapFunc.renderObject({
          data: resp,
          layer: mapLayers[key],
          key: key,
          fitBound: true
        })
      })
    }
  })
}
