const config = require('./Config')
const services = require('./WebService')
const internal = services.internal
const idm = services.idm
const log = serverUtils.getLogger('lib.InternalService')

const token = 'Basic ' + Buffer.from(`${config.auth.clientId}:${config.auth.clientSecret}`).toString('base64')

exports.listNodes = function (data, res, next, callback, fallout) {
  log.info(`[POST] ${internal.defaults.baseURL}/internal/node/list - data: ${JSON.stringify(data)}`)
  return internal
    .post('/internal/node/list', data, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response)
        log.error(
          '[ERROR] /internal/node/list - [%s:%s] %s\ndata = %o',
          err.status,
          err.statusText,
          err.message,
          data
        )
      else log.error('[ERROR] /internal/node/list - [%s]\ndata = %o', err.message, data)
      if (fallout) {
        fallout(err)
      } else {
        if (err.status === 404) {
          callback({ nodes: [] })
        } else {
          next(err)
        }
      }
    })
}

exports.createNode = function (data, res, next, callback, fallout) {
  log.debug('[POST] /internal/node')

  return internal
    .post('/internal/node', data, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.cypher = function (data, res, next, callback, fallout) {
  log.info('[POST] /internal/cypher')

  return internal
    .post('/internal/cypher', data, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.getNode = function (nodeId, includeRelation, res, next, callback, fallout) {
  log.debug(`[GET] /internal/node?id=${nodeId}&includeRelations=${includeRelation}`)
  return internal
    .get(`/internal/node?id=${nodeId}&includeRelations=${includeRelation}`, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.getNodesByLabelPath = function (nodeId, labels, res, next, callback, fallout) {
  log.debug(`[GET] /internal/nodesByLabelPath?id=${nodeId}&labels=${labels}`)
  return internal
    .get(`/internal/nodesByLabelPath?id=${nodeId}&labels=${labels}`, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.getNodeSelectedRelationship = function (nodeId, relationshipTypes, res, next, callback, fallout) {
  log.debug(`[GET] /internal/node?id=${nodeId}&includeRelations=true&relationshipTypes=${relationshipTypes}`)
  return internal
    .get(`/internal/node?id=${nodeId}&includeRelations=true&relationshipTypes=${relationshipTypes}`, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.updateNode = function (data, res, next, callback, fallout) {
  log.debug('[PUT] /internal/node')

  return internal
    .put('/internal/node', data, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.deleteNode = function (nodeId, res, next, callback, fallout) {
  log.debug(`[DELETE] /internal/node?id=${nodeId}`)
  return internal
    .delete(
      `/internal/node?id=${nodeId}`,
      { headers: { 'X-Requester': res.locals.userId, Authorization: token } }
    )
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.deleteNodeWithEdges = function (data, res, next, callback, fallout) {
  log.debug('[DELETE] /internal/nodeWithRelations')

  return internal
    .delete('/internal/nodeWithRelations', {
      data: data,
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.createRelationship = function (data, res, next, callback, fallout) {
  log.debug('[POST] /internal/relationship')

  return internal
    .post('/internal/relationship', data, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.deleteRelationship = function (relationshipId, res, next, callback, fallout) {
  log.debug(`[DELETE] /internal/relationship?id=${relationshipId}`)
  log.debug(token)
  return internal
    .delete(
      `/internal/relationship?id=${relationshipId}`,
      { headers: { 'X-Requester': res.locals.userId, Authorization: token } }
    )
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.deleteNodeProperties = function (nodeId, properties, res, next, callback, fallout) {
  let url = `/internal/node/property?id=${nodeId}`
  log.debug(`[DELETE] ${url}`)

  return internal
    .delete(url, {
      data: properties,
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.moveRelationship = function (data, res, next, callback, fallout) {
  let url = `/internal/relationship/move?id=${data.id}`
  if (data.endNodeId) url += `&endNodeId=${data.endNodeId}`
  if (data.startNodeId) url += `&startNodeId=${data.startNodeId}`

  log.debug(`[PUT] ${url}`)

  return internal
    .put(url, data, { headers: { 'X-Requester': res.locals.userId, Authorization: token } })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.updateRelationship = function (data, res, next, callback, fallout) {
  log.debug('[PUT] /internal/relationship')

  return internal
    .put('/internal/relationship', data, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.predefinedQuery = function (data, res, next, callback, fallout) {
  log.info(`[POST] /execute/${data.collection}/${data.type}/${data.name} - data: ${JSON.stringify(data.body)}`)
  return internal
    .post(`/execute/${data.collection}/${data.type}/${data.name}`, data.body, {
      headers: {
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response)
        log.error(`[ERROR] /execute/${data.collection}/${data.type}/${data.name} - [%s:%s] %s\ndata = %o`, err.status, err.statusText, err.message, data)
      else
        log.error(`[ERROR] /execute/${data.collection}/${data.type}/${data.name} - [%s]\ndata = %o`, err.message, data)
      if (fallout) {
        fallout(err)
      } else {
        if (err.status === 404) {
          callback({
            nodes: []
          })
        } else {
          next(err)
        }
      }
    })
}

exports.getUserGroup = function (res, next, callback, fallout) {
  const reqData = {
    label: 'UserGroup'
  }

  return idm
    .post('/v1/common/nodeList', reqData, {
      headers: { 'X-Requester': res.locals.userId, Authorization: token }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      log.error(err)
      if (fallout) {
        fallout(err)
      } else {
        if (err.status === 404) {
          callback({ nodes: [] })
        } else {
          next(err)
        }
      }
    })
}

exports.spatialIntersect = function (data, res, next, callback, fallout) {
  log.info(`[POST] /spatial/intersect - data: ${JSON.stringify(data)}`)
  return internal
    .post(`/spatial/intersect`, data, {
      headers: {
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response)
        log.error(`[ERROR] /spatial/intersect - [%s:%s] %s\ndata = %o`, err.status, err.statusText, err.message, data)
      else
        log.error(`[ERROR] /spatial/intersect - [%s]\ndata = %o`, err.message, data)
      if (fallout) {
        fallout(err)
      } else {
        if (err.status === 404) {
          callback({
            nodes: []
          })
        } else {
          next(err)
        }
      }
    })
}

exports.spatialDelete = function (data, res, next, callback, fallout) {
  log.debug(`[DELETE] /spatial/delete`)
  return internal
    .delete(
      `/spatial/delete`, data, {
      headers: {
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    }
    )
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (fallout) {
        fallout(err)
      } else {
        next(err)
      }
    })
}

exports.spatialList = function (data, res, next, callback, fallout) {
  log.info(`[POST] /spatial/list - data: ${JSON.stringify(data)}`)
  return internal
    .post(`/spatial/list`, data, {
      headers: {
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response)
        log.error(`[ERROR] /spatial/list - [%s:%s] %s\ndata = %o`, err.status, err.statusText, err.message, data)
      else
        log.error(`[ERROR] /spatial/list - [%s]\ndata = %o`, err.message, data)
      if (fallout) {
        fallout(err)
      } else {
        if (err.status === 404) {
          callback({
            nodes: []
          })
        } else {
          next(err)
        }
      }
    })
}

exports.spatialUpsert = function (data, res, next, callback, fallout) {
  log.info(`[POST] /spatial/add - data: ${JSON.stringify(data)}`)
  return internal
    .post(`/spatial/add`, data, {
      headers: {
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response)
        log.error(`[ERROR] /spatial/add - [%s:%s] %s\ndata = %o`, err.status, err.statusText, err.message, data)
      else
        log.error(`[ERROR] /spatial/add - [%s]\ndata = %o`, err.message, data)
      if (fallout) {
        fallout(err)
      } else {
        if (err.status === 404) {
          callback({
            nodes: []
          })
        } else {
          next(err)
        }
      }
    })
}

exports.addDocument = function (data, path, req, res, next, callback, fallout) {
  log.info(`[POST] /document?path=${path}`)
  return internal
    .post(`/document?path=${path}`, data, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        Authorization: token,
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`
      }
    })
    .then(function (resp) {
      callback(resp)
    })
    .catch(function (err) {
      if (err.response) {
        log.error('[ERROR] /document - [%s:%s] %s\ndata = %o', err.response.status, err.response.statusText, err.message, data)
      } else {
        log.error('[ERROR] /document - [%s]\ndata = %o', err.message, data)
      }
      if (fallout) {
        fallout(err)
      } else {
        if (err.response.status === 404) {
          callback({
            nodes: []
          })
        } else {
          next(err)
        }
      }
    })
}

exports.getDocumentById = (objectName, next, res, callback, fallout) => {
  log.info(`[GET] /document?objectName=${objectName}`)
  return internal.get(`/document?objectName=${objectName}`, {
    responseType: 'arraybuffer',
    headers: {
      Authorization: token
    }
  })
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
      if (fallout) {
        fallout(error)
      } else {
        next(error)
      }
    })
}

exports.deleteDocument = (objectName, next, res, callback, fallout) => {
  log.info(`[DELETE] /document?objectName=${objectName}`)
  return internal.delete(`/document?objectName=${objectName}`, {
    headers: {
      Authorization: token
    }
  })
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
      if (fallout) {
        fallout(error)
      } else {
        next(error)
      }
    })
}









