const services = require('./WebService')
const config = require('./Config')
const idm = services.idm
const log = serverUtils.getLogger('lib.AuthService')

const audience = config.auth.audience
const authorization = 'Basic ' + Buffer.from(`${config.auth.clientId}:${config.auth.clientSecret}`).toString('base64')


exports.authenticate = function (username, password, mfacode, provider, callback, fallout) {
  log.info(`[POST] /v1/auth/token ${username}`)
  let prov = ""
  if (provider) prov = `&auth=${provider}`
  idm.post(`/v1/auth/token?aud=${audience}${prov}`, `grant_type=password&username=${username}&password=${password}&mfacode=${mfacode}`, {
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(function (resp) {
      callback(resp.data)
    })
    .catch(function (err) {
      log.error(err)
      fallout(err)
    })
}


exports.authorize = function (authToken, resource, action, next, callback, fallout) {
  const req = {
    accessToken: authToken,
    tokenTypeHint: 'BEARER',
    resourceAttribute: resource,
    actionAttribute: action
  }
  log.info(`[POST] ${idm.defaults.baseURL}/v1/oauth2/introspect ${JSON.stringify(req)}`)
  idm.post('/v1/oauth2/introspect', req, {
    headers: { Authorization: 'Bearer ' + config.auth.resourceServerToken }
  }).then(function (resp) {
    if (!resp.data.active) {
      throw {
        status: 403,
        message: 'Access denied',
        description: action.name + ' ' + resource.name + (resource.networkRole ? ' ' + resource.networkRole : '')
      }
    }
    if (callback)
      callback()
  })
    .catch(function (err) {
      if (fallout) fallout(err)
      else next(err)
    })
}

exports.requestQRCode = function (data, res, next, callback, fallout) {
  log.info(`[GET] /v1/hash/MFAQRCode?username=${data}`)
  idm.get(`/v1/hash/MFAQRCode?username=${data}`, {
    responseType: 'arraybuffer',
    headers: {
      Authorization: authorization
    }
  })
    .then(function (response) {
      callback(response)
    }).catch(function (error) {
      fallout(error)
    })
}

exports.setMFASecretIdentity = function (data, res, next, callback, fallout) {
  log.info(`[PATCH] /v1/account/${data.accountName}/identity/${data.name}/mfaSecret?enable=true`)
  idm.patch(`/v1/account/${data.accountName}/identity/${data.name}/mfaSecret?enable=true`, `secret=${data.secret}`, {
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}

exports.verifyMFACode = function (data, res, next, callback, fallout) {
  log.info(`[GET] /v1/auth/verifyMFA?aud=${data.aud}&code=${data.code}`)
  idm.get(`/v1/auth/verifyMFA?aud=${data.aud}&code=${data.code}`, {
    headers: {
      Authorization: authorization
    }
  })
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}

// API Common
exports.listNodes = function (data, res, next, callback, fallout) {
  log.debug(`[POST] /v1/common/nodeList - data: ${JSON.stringify(data)}`)
  log.debug(data)
  return idm
    .post('/v1/common/nodeList', data, {
      headers: {
        'X-Requester': 'idc',
        Authorization: authorization
      }
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

exports.getUserIdentity = function (data, res, next, callback, fallout) {
  log.info(`[GET] /v1/account/${data.accountName}/identity/${data.name}`)
  idm.get(`/v1/account/${data.accountName}/identity/${data.name}`, {
    headers: {
      Authorization: authorization
    }
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

exports.getUserScopes = function (data, res, next, callback, fallout) {
  log.info(`[GET] /v1/account/${data.accountName}/identity/${data.name}/scopes`)
  idm.get(`/v1/account/${data.accountName}/identity/${data.name}/scopes`, {
    headers: {
      Authorization: authorization
    }
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

exports.generateRandomPassword = function (data, res, next, callback, fallout) {
  log.info(`[GET] /v1/hash/random`)
  idm.get(`/v1/hash/random?length=${data}`)
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}

exports.disableMFA = function (data, res, next, callback, fallout) {
  log.info(`[PATCH] /v1/account/${data.accountName}/butity/${data.name}/disableMFA`)
  idm.patch(`/v1/account/${data.accountName}/identity/${data.name}/disableMFA`, '', {
    headers: {
      Authorization: authorization
    }
  })
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}

exports.setPassword = function (data, res, next, callback, fallout) {
  log.info(`[PUT] /v1/hash/setPassword`)
  idm.put('/v1/hash/setPassword', `identityName=${data.identity}&password=${data.password}`, {
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}

exports.changePassword = function (data, res, next, callback, fallout) {
  log.info(`[PUT] /v1/hash/changePassword`)
  idm.put('/v1/hash/changePassword', `identityName=${res.locals.userId}&oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`, {
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}

exports.sendEmail = function (data, res, next, callback, fallout) {
  log.info(`[POST] /v1/common/sendEmail`)
  idm.post('/v1/common/sendEmail', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authorization
    }
  })
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}

exports.checkPasswordRequirement = function (data, res, next, callback, fallout) {
  log.info(`[POST] /v1/hash/checkPassword`)
  idm.post('/v1/hash/checkPassword', `password=${data}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(function (response) {
      callback(response.data)
    }).catch(function (error) {
      fallout(error)
    })
}