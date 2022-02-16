const services = require('./WebService')
const api = services.geospatial
const log = serverUtils.getLogger('lib.GeoSpatialService')
const config = require('./Config')

const token = 'Basic ' + Buffer.from(`${config.auth.clientId}:${config.auth.clientSecret}`).toString('base64')

exports.upsert = function (data, res, next, callback, fallout) {
  log.info(`[POST] ${data.objectType}/${data.key} - data: ${JSON.stringify(data)}`)
  return api.post(`${data.objectType}/${data.key}`, data.body, {
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
  log.info(`[POST] ${data.objectType}/intersect - data: ${JSON.stringify(data)}`)
  return api.post(`${data.objectType}/intersect`, data.body, {
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
  log.debug(`[DELETE] ${data.objectType}/${data.key}`)
  return api.delete(`${data.objectType}/${data.key}`,
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
  log.info(`[POST] ${data.objectType}/list - data: ${JSON.stringify(data)}`)
  return api.post(`${data.objectType}/list`, data.body, {
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