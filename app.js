const express = require('express')
const path = require('path')
//const favicon = require('serve-favicon') TODO
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const debugApp = require('debug')('congressweb:app')

// Environment variables setup
require('dotenv').config()

const passport = require('passport')
const helmet = require('helmet')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
var flash = require('connect-flash')

const APP_MOUNT_DIR = process.env.APP_MOUNT_DIR

/////////////////////////////////////////////////////////
/////////// HELPERS /////////////////////////////////////
const database = require('./helpers/database')
const auth = require('./helpers/auth')
const addRenderingData = require('./helpers/addRenderingData')
const checkAuth = require('./helpers/checkAuth')
/////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////
/////////// ROUTES /////////////////////////////////////////////////
const index = require('./routes/index')
const users = require('./routes/users')
const login = require('./routes/login')
const registration = require('./routes/registration')
const participants = require('./routes/participants')
const manageParticipants = require ('./routes/manageParticipants')
const admin = require('./routes/admin')
const userRegistration = require('./routes/userRegistration')
const abstract = require('./routes/abstract')
////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////
/////////// BASIC EXPRESS SETUP /////////////////////////
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(cookieParser())
app.use(APP_MOUNT_DIR, express.static('public'))
app.use(flash())

/// Using helmet to help secure the server
app.use(helmet())
//////////////////////////////////////////////////////////

database.connect()
	.then(setupPassport)
	.then(setupPaths)
	.then(() => {
		debugApp('Application initialization finished successfully!')
	}).catch((err) => {
		debugApp('Error found while initializing the application: ' + err)
	})

///////////////////////////////////////////////////////////
////////////////     PASSPORT     /////////////////////////
///////////////////////////////////////////////////////////
function setupPassport() {
	return new Promise((resolve, reject) => {
		debugApp('Setting up passport')
		app.use(session({ // Session initialization
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
				secure: true,
				maxAge: 604800000, // 7 days
				httpOnly: true // helps mitigate some attacks
			},
			store: new MongoStore({
				mongooseConnection: database.get()
			})
		}))
		app.use(passport.initialize())
		app.use(passport.session())

		// Local Strategy initialization
		passport.use(new LocalStrategy(auth))

		passport.serializeUser(function(user, done) {
			done(null, user._id)
		})

		const User = require('./models/User')
		passport.deserializeUser(function(id, done) {
			User.findById(id, (err, user) => {
				done(err, user)
			})
		})
		resolve()
	})

}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function setupPaths() {
	return new Promise((resolve, reject) => {
		debugApp('Setting up the application paths')
		// Add the user and registering info to the request
		app.use(addRenderingData)

		// Redirect all http requests to https
		app.all('*', (req, res, next) => {
			if (req.secure) {
				return next()
			}
			res.redirect('https://' + req.hostname + req.path)
		})

		app.use(APP_MOUNT_DIR + '/', index)
		app.use(APP_MOUNT_DIR + '/index', index)
		app.use(APP_MOUNT_DIR + '/users', users)
		app.use(APP_MOUNT_DIR + '/login', login)
		app.use(APP_MOUNT_DIR + '/registration', registration)
		app.use(APP_MOUNT_DIR + '/participants', participants)
		app.use(APP_MOUNT_DIR + '/manageParticipants', checkAuth, manageParticipants)
		app.use(APP_MOUNT_DIR + '/admin', checkAuth, admin)
		app.use(APP_MOUNT_DIR + '/userRegistration', userRegistration)
		app.use(APP_MOUNT_DIR + '/abstract', abstract)

		app.get(APP_MOUNT_DIR + '/logout', (req, res) => {
			req.logout()
			res.redirect(APP_MOUNT_DIR + '/')
		})

		app.post(APP_MOUNT_DIR + '/auth', passport.authenticate('local', {
			successRedirect: APP_MOUNT_DIR + '/admin',
			failureRedirect: APP_MOUNT_DIR + '/login',
			failureFlash: true
		}))

		// catch 404 and forward to error handler
		app.use(function(req, res, next) {
			var err = new Error('Not Found')
			err.status = 404
			res.statusCode = 404
			req.app.locals.renderingOptions.title = '404'
			res.render('404', req.app.locals.renderingOptions)
		})

		// error handler
		// TODO: prevent this from leaking more data
		app.use(function(err, req, res) {
			// set locals, only providing error in development
			res.locals.message = err.message
			debugApp('Current env is: ' + req.app.get('env'))
			res.locals.error = req.app.get('env') === 'development' ? err : {}

			// render the error page
			res.status(err.status || 500)
			res.render('error')
		})

		resolve()
	})

}

module.exports = app