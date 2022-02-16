// copy text to clipboard
mapFunc.copyText = (value, info) => {
  const $temp = $('<input>')
  $('body').append($temp)
  $temp.val(value).select()
  document.execCommand('copy')
  $temp.remove()
  if (!info) info = 'Text'
  iziToast.info({
    title: info,
    message: 'copied to clipboard',
    timeout: 2000
  })
  return value
}

// convert layer to WKT
mapFunc.toWKT = layer => wellknown.stringify(layer.toGeoJSON())

// convert layer to WKT
mapFunc.geoJSONToWKT = geoJSON => wellknown.stringify(geoJSON)

// generate UUID
mapFunc.generateUUID = () => {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid.toUpperCase()
}

mapFunc.validateMapFields = (field, cb) => {
  var message = []
  field = JSON.parse(field.replace(/&quot;/g,'"'))
  field.forEach(function(item, index){
    if(item.required){
      var getValue = $('input[name='+item.name+']').val()
      if(getValue === '' || getValue === null){
        message.push(item.label)
      }
    }
  })
  if(Object.keys(message).length > 0){
    alert(message.join().replace(',',', ') + ' is Required.')
    cb(false)
  }else{
    cb(true)
  }
}