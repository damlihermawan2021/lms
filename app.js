const log = serverUtils.getLogger('app')
const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const authService = require('./lib/AuthService')
const cookieSer = require('./lib/CookieSer')
const config = require('./lib/Config')
const jwtDecode = require('jwt-decode')
const fileUpload = require('express-fileupload')
const helmet = require('helmet')


const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('x-powered-by', 'TCF')

// resource middleware
app.use(fileUpload())
app.use(helmet.frameguard())
app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ imit: '50mb', extended: true, parameterLimit: 1000000 }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600 }))

// access logger
app.use(morgan('combined', { stream: serverUtils.morganAccessLogStream }))

let appEnv = serverConfig.serviceEnv === 'prod' ? '' : serverConfig.serviceEnv

app.get('/logout', function (req, res) {
  res.clearCookie(serverConfig.server.name + '_' + appEnv)
  renderLoginPage(req, res, 'logout successful', true)
})

app.get('/login', function (req, res) {
  if (req.cookies[serverConfig.server.name + '_' + appEnv]) {
    res.redirect('/')
  } else {
    renderLoginPage(req, res, '', false)
  }
})    

app.post('/login', function (req, res, next) {
  const term = req.body.term

  if (!term) {
    renderLoginPage(req, res, 'Login failed, please accept term first', false)
  } else {
    authService.authenticate(req.body.username, req.body.password, req.body.mfacode, req.body.authprovider,
      function (resp) {
        let decodedToken = jwtDecode(resp.access_token)
        res.cookie(
          serverConfig.server.name + '_' + appEnv,
          cookieSer.ser({
            token: resp.access_token,
            username: decodedToken.uid,
            fullname: decodedToken.sub,
            id: decodedToken.uid
          }), {
          httpOnly: true,
          secure: serverConfig.server.scheme === 'HTTPS'
        }
        )
        res.status(200).redirect('/')
      },
      function (err) {
        log.debug(err)
        res.clearCookie(serverConfig.server.name + '_' + appEnv)
        if (typeof err.error_description === 'undefined') {
          renderLoginPage(req, res, 'Login failed, please try again', false)
        } else {
          renderLoginPage(req, res, err.error_description, false)
        }
      }
    )
  }

})

// 'catch-all' method
app.use(function (req, res, next) {
  log.info(`[${req.method}] ${req.originalUrl}`)
  // bypass auth check for static contents
  if (req.path.startsWith('/stylesheets') || req.path.startsWith('/javascripts')) {
    return next()
  }

  // check cookie validity
  if (req.cookies[serverConfig.server.name + '_' + appEnv]) {
    const cookie = cookieSer.dser(req.cookies[serverConfig.server.name + '_' + appEnv])
    if (cookie.token) {
      res.locals.token = cookie.token
      res.locals.userId = cookie.username
      res.locals.user = cookie.fullname
      res.locals.version = serverConfig.version
      res.locals.appEnv = appEnv
      res.locals.menu = serverConfig.app.menu,
        res.locals.appsName = serverConfig.server.title
      res.locals.currentLink = req.originalUrl
      return next()
    } else {
      res.clearCookie(serverConfig.server.name + '_' + appEnv)
      renderLoginPage(req, res, 'User session has expired. Please login again', false)
    }
  } else {
    // this handles redirect from /logout
    // do not check cookie if it does not exist
    renderLoginPage(req, res, 'Logout successful', false)
  }
})

// routes
app.use('/', require('./routes/home'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.statusCode = 404
  next({
    status: 404,
    message: 'Page Not Found: ' + req.url
  })
})

// generic error handling and terminate all unhandled request
app.use(function (err, req, res, next) {
  // construct error object
  let error = err
  if (err.response) {
    error.status = res.statusCode = err.response.status
    error.message = err.response.statusText
    error.description = err.response.data.message ?
      err.response.data.message +
      ': ' +
      (err.response.data.description ? err.response.data.description : JSON.stringify(err.response.data.objects)) :
      err.response.data
  } else if (err.syscall) {
    error.stack = err.syscall + ' ' + err.code + ' ' + err.address + ':' + err.port
  }
  if (!err.status) {
    error.status = res.statusCode = 500
    error.message = error.message || 'Internal Server Error'
  }
  error.path = req.path
  error.method = req.method
  error.data = req.body
  error.isAjax = req.xhr

  // log to output/logfile
  log.error(error)

  // send json or render error page
  if (req.xhr) {
    res.status(err.status).send({
      status: err.status,
      message: err.message,
      description: err.description
    })
  } else {
    res.statusCode = err.status
    res.render('error', {

      errCode: err.status + ' ' + err.message,
      errMessage: err.description ? err.description : ''
    })
  }

  next()
})

process.on('uncaughtException', function (err) {
  log.error(err)
})

const renderLoginPage = (req, res, message, isInfo) => {
  if (req.cookies[serverConfig.server.name + '_' + appEnv]) {
    res.redirect('/logout')
  } else {
    res.render('login', {
      title: `${serverConfig.server.title.toUpperCase()} ${serverConfig.serviceEnv === 'prod' ? '' : serverConfig.serviceEnv}`,
      authMessage: message,
      version: serverConfig.version,
      authMessageInfo: isInfo
    })
  }
}

module.exports = app