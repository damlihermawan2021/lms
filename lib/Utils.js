const rfs = require('rotating-file-stream')
const config = require('./Config')
const fs = require('fs')
const moment = require('moment')

const pad = num => (num > 9 ? '' : '0' + num)

// log directory
const logDirectory = config.server.logDirectory
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const morganAccessLogStream = rfs.createStream(
  time => {
    if (!time) return 'access.log'
    let month = time.getFullYear() + '' + utils.pad(time.getMonth() + 1)
    let day = utils.pad(time.getDate())
    return `access-${month}${day}.log`
  },
  {
    interval: '1d', // rotate daily
    path: logDirectory,
    compress: 'gzip'
  }
)

// const getLogger = cat => config.configureLog4js(cat).getLogger(cat)
// initial configuration based on config.yml is in Config.js
const getLogger = log4js.getLogger

const formatDate = date => {
  return date
    ? moment(new Date(date))
      .format('YYYY/MM/DD HH:mm:ss Z')
      .replace(/:\d\d$/, '')
      .replace(/([+-])0(\d)$/, '$1$2')
    : 'Not Set'
}

const utils = {
  pad,
  logDirectory,
  getLogger,
  morganAccessLogStream,
  formatDate
}

module.exports = utils
