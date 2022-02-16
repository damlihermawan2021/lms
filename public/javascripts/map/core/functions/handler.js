mapFunc.loadEditForm = uid => {
  const l = mapFunc.getLayer(uid)
  $('#editObjectGeoJSON').val(JSON.stringify(l.feature))
  $('#editObjectWKT').val(mapFunc.geoJSONToWKT(l.feature))
  $('#editFormContainer').empty()
  mapFunc.requestData(`${mapConfig.formRoute}/getTemplate/${mapConfig.layers[l.group].editForm}`, {
    method: 'POST',
    data: l.feature
  }, resp => {
    $('#editFormContainer').html(resp)
    $('#editForm').transition('vertical flip').modal('show')
    l.closePopup()
  })
}

mapFunc.showCreateForm = layer => {
  $('#createObjectGeoJSON').val(JSON.stringify(layer.toGeoJSON()))
  $('#createObjectWKT').val(mapFunc.toWKT(layer))
  $('#createForm').transition('vertical flip').modal('show')
}

$('#layerType').change(function () {
  $('#createFormContainer').empty()
  const c = mapConfig.layers[$(this).val()]
  if (c) {
    mapFunc.requestData(`${mapConfig.formRoute}/getTemplate/${c.createForm}`, {
      method: 'POST',
      isLoading: true
    }, resp => {
      $('#createFormContainer').html(resp)
    })
  }
})

mapFunc.renderObject = params => {
  params.layer.on('layeradd', e => e.layer.setup(params.key))
  params.layer.addData(params.data)
  if (params.fitBound === true) {
    map.fitBounds(params.layer.getBounds())
  }
}

mapFunc.callHandler = (path, method, uid) => {
  const l = mapFunc.getLayer(uid)
  mapFunc.requestData(
    path,
    {
      method: method,
      data: l.feature,
      isLoading: true
    },
    function (data) {
      l.closePopup()
      iziToast.success({
        title: data.code,
        message: data.message,
        timeout: 3000
      })
    }
  )
}

mapFunc.deleteHandler = uid => {
  if (confirm('Are you sure?') === true) {
    mapFunc.getLayer(uid).handleDelete()
  }
}

mapFunc.toggleEditHandler = uid => mapFunc.getLayer(uid).toggleEdit()

mapFunc.confirmDelete = uid => {
  $('#confirm')
    .modal({
      onApprove: function () {
        mapFunc.getLayer(uid).handleDelete()
      }
    })
    .modal('show')
}
