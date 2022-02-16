mapFunc.registerLayer = layer => {
  mapLayers[layer.uid] = `${layer.group}:${layer._leaflet_id}`
}

mapFunc.deregisterLayer = layer => delete mapLayers[layer.uid]

mapFunc.getLayer = uid => {
  const path = mapLayers[uid].split(':')
  return mapLayers[path[0]].getLayer(path[1])
}
