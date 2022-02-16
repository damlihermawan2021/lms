const config = require('./Config')
const services = require('./WebService')
const medio = services.medio
const log = serverUtils.getLogger('lib.MedioService')

const token = 'Basic ' + Buffer.from(`${config.auth.clientId}:${config.auth.clientSecret}`).toString('base64')

exports.listNodes = function (data, res, next, callback, fallout) {

  log.info(`[POST] /graph/graph02/node/list - data: ${JSON.stringify(data)}`)
  return medio.post('/graph/graph02/node/list', data, {
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
        log.error(
          '[ERROR] /graph/graph02/node - [%s:%s] %s\ndata = %o',
          err.status,
          err.statusText,
          err.message,
          data
        )
      else log.error('[ERROR] /graph/graph02/node - [%s]\ndata = %o', err.message, data)
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
  console.log('==============',res);
  log.debug('[POST] /graph/graph02/node')

  return medio
    .post('/graph/graph02/node', data, {
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
  log.debug(`[GET] /graph/graph02/node?id=${nodeId}&includeRelations=${includeRelation}`)
  return medio
    .get(`/graph/graph02/node?id=${nodeId}&includeRelations=${includeRelation}`, {
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
  log.debug('[PUT] /graph/graph02/node')

  return medio
    .put('/graph/graph02/node', data, {
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
  log.debug(`[DELETE] graph/graph02/node?id=${nodeId}`)
  return medio
    .delete(
      `graph/graph02/node?id=${nodeId}`,
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

exports.createRelationship = function (data, res, next, callback, fallout) {
  log.debug('[POST] /graph/graph02/relationship')

  return medio
    .post('/graph/graph02/relationship', data, {
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
  console.log(data)
  log.info(`[POST] /graph/execute/graph02/${data.collection}/${data.type}/${data.name} - data: ${JSON.stringify(data.body)}`)
  return medio
    .post(`/graph/execute/graph02/${data.collection}/${data.type}/${data.name}`, data.body, {
      headers: {
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response) { log.error(`[ERROR] /v1/graph/execute/graph02/${data.collection}/${data.type}/${data.name} - [%s:%s] %s\ndata = %o`, err.status, err.statusText, err.message, data) } else { log.error(`[ERROR] /execute/${data.collection}/${data.type}/${data.name} - [%s]\ndata = %o`, err.message, data) }
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

exports.upsert = function (data, res, next, callback, fallout) {
  log.info(`[POST] /spatial/object/spatial01/${data.objectType}/${data.key} - data: ${JSON.stringify(data)}`)
  return medio.post(`/spatial/object/spatial01/${data.objectType}/${data.key}`, data.body, {
      headers: { 
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response) {
        log.error(
          `[ERROR] /${data.objectType}/${data.key} - [%s:%s] %s\ndata = %o`,
          err.status,
          err.statusText,
          err.message,
          data
        )
      } else log.error(`[ERROR] /${data.objectType}/${data.key} - [%s]\ndata = %o`, err.message, data)
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

exports.intersect = function (data, res, next, callback, fallout) {
  log.info(`[POST] /spatial/object/spatial01/${data.objectType}/intersect - data: ${JSON.stringify(data)}`)
  return medio.post(`/spatial/object/spatial01/${data.objectType}/intersect`, data.body, {
      headers: { 
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response) {
        log.error(
          `[ERROR] /${data.objectType}/intersect - [%s:%s] %s\ndata = %o`,
          err.status,
          err.statusText,
          err.message,
          data
        )
      } else log.error(`[ERROR] /${data.objectType}/intersect - [%s]\ndata = %o`, err.message, data)
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

exports.delete = function (data, res, next, callback, fallout) {
  log.debug(`[DELETE] /spatial/object/spatial01/${data.objectType}/${data.key}`)
  return medio.delete(`/spatial/object/spatial01/${data.objectType}/${data.key}`,
      { 
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

exports.list = function (data, res, next, callback, fallout) {
  log.info(`[POST] /spatial/object/spatial01/${data.objectType}/list - data: ${JSON.stringify(data)}`)
  return medio.post(`/spatial/object/spatial01/${data.objectType}/list`, data.body, {
      headers: { 
        'X-Requester': res.locals.userId,
        Authorization: token
      }
    })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      if (err.response) {
        log.error(
          `[ERROR] /${data.objectType}/list - [%s:%s] %s\ndata = %o`,
          err.status,
          err.statusText,
          err.message,
          data
        )
      } else log.error(`[ERROR] /${data.objectType}/list - [%s]\ndata = %o`, err.message, data)
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