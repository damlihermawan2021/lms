const yaml = require('js-yaml')
const fs = require('fs')
const configFile = 'config.yml'
log4js = require('log4js')

module.exports = (() => {
  const config = {
    version: process.env.npm_package_version,
    serviceEnv: process.env.SERVICE_ENV
  }

  const trace = function (obj, ref) {
    for (const key in ref) {
      if (Object.prototype.hasOwnProperty.call(ref, key)) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = ref[key]
        } else if (ref[key].constructor.name === 'Object') {
          obj[key] = trace(obj[key], ref[key])
        }
      }
    }
    return obj
  }

  try {
    Object.assign(config, yaml.safeLoad(fs.readFileSync(configFile, 'utf8')))
    const common = config.environtment.common
    if (config.environtment[config.serviceEnv]) {
      Object.assign(config, trace(config.environtment[config.serviceEnv], common))
    } else {
      Object.assign(config, common)
    }
    delete config.environtment
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  const categories = {}
  for (const cat of Object.keys(config.server.logLevel)) {
    const level = config.server.logLevel[cat]
    categories[cat] = { appenders: ['out', 'everything'], level: level }
  }
  log4js.configure({
    appenders: {
      everything: {
        type: 'dateFile',
        filename: config.server.logDirectory + '/app.log',
        pattern: 'yyyyMMdd',
        keepFileExt: true,
        compress: true
      },
      out: { type: 'stdout' }
    },
    categories: categories
  })

  return config
})()
