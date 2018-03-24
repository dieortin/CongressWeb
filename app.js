const express = require('express')
const path = require('path')
//const favicon = require('serve-favicon') TODO
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
//const debugApp = require('debug')('congressweb:app')

// Environment variables setup
require('dotenv').config()

const passport = require('passport')
const helmet = require('helmet')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')


/////////////////////////////////////////////////////////
/////////// HELPERS /////////////////////////////////////
const database = require('./helpers/database')
const auth = require('./helpers/auth')
/////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////
/////////// ROUTES //////////////////////////////////////
const index = require('./routes/index')				/////
const users = require('./routes/users')				/////
const login = require('./routes/login')				/////
const signup = require('./routes/signup')			/////
const restricted = require('./routes/restricted')	/////
/////////////////////////////////////////////////////////


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
app.use(express.static('public'))

/// Using helmet to help secure the server
app.use(helmet())
//////////////////////////////////////////////////////////

database.connect()

///////////////////////////////////////////////////////////
////////////////     PASSPORT     /////////////////////////
///////////////////////////////////////////////////////////
app.use(session({ // Session initialization
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
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
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


app.all('*', (req, res, next) => {
	if (req.secure) {
		return next()
	}
	res.redirect('https://' + req.hostname + req.path)
})

app.use('/', index)
app.use('/users', users)
app.use('/login', login)
app.use('/signup', signup)
app.use('/restricted', restricted)

app.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

app.post('/auth', passport.authenticate('local', {
	successRedirect: '/restricted',
	failureRedirect: '/login',
	failureFlash: false
}))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app