const axios = require('axios')
const log = serverUtils.getLogger('lib.WebService')

exports.idm = axios.create(serverConfig.service.idm)
log.info('IDM-API : ' + serverConfig.service.idm.baseURL)

exports.internal = axios.create(serverConfig.service.internal)
log.info('GRAPH-API : ' + serverConfig.service.internal.baseURL)

exports.spatial = axios.create(serverConfig.service.spatial)
log.info('SPATIAL-API : ' + serverConfig.service.spatial.baseURL)
