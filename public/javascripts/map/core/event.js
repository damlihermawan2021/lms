// map.on('pm:create', function (e) {
//   e.layer.on('pm:edit', function (_ignored) {})
//   e.layer.on('pm:dragend', function (_ignored) {})

//   e.layer.bindContextMenu({
//     contextmenu: true,
//     contextmenuItems: [
//       { separator: true },
//       {
//         text: 'Submit object',
//         callback: function () {
//           mapFunc.showCreateForm(e.layer)
//         }
//       }
//     ]
//   })
//   mapConfig.drawLayer.addLayer(e.layer)
// })

map.on('zoomend', function () {
  $('#zoomLevel').text(map.getZoom())
})

map.on('mousemove', function (e) {
  $('.latlng').html('LAT ' + e.latlng.lat + ' ' + 'LNG ' + e.latlng.lng)
})

map.on('click', function (e) {
  mapFunc.copyText('POINT(' + e.latlng.lng + ' ' + e.latlng.lat + ')', ' Coordinate')
})

map.on('pm:create', function (e) {
  e.layer.on('pm:edit', function (_ignored) {})
  e.layer.on('pm:dragend', function (_ignored) {})
  e.layer.bindContextMenu({
    contextmenu: true,
    contextmenuItems: [
      { separator: true },
      {
        text: 'Copy Geometry WKT Format',
        callback: function () {
          mapFunc.copyText(mapFunc.toWKT(e.layer), ' Coordinate')
        }
      }
    ]
  })
  // map.addLayer(e.layer)
  mapConfig.drawLayer.addLayer(e.layer)
})
