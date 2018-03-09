const express = require('express')
const path = require('path')
//const favicon = require('serve-favicon') TODO
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const debugApp = require('debug')('congressweb:app')
const debugDb = require('debug')('congressweb:db')

// Environment variables setup
require('dotenv').config()

const passport = require('passport')
const mongoose = require('mongoose')
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

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
app.use(express.static(path.join(__dirname, 'public')))

/// Using helmet to help secure the server
app.use(helmet())
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
//////////// DATABASE CONNECTION /////////////////////////
const dbopt = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	pass: process.env.DATABASE_PASSWORD,
	port: process.env.DATABASE_PORT,
	path: process.env.DATABASE_PATH
}
const dbCredString = dbopt.user + ':' + dbopt.pass
const dbHostString = dbopt.host + ':' + dbopt.port + '/' + dbopt.path
const dbCompletePath =  dbCredString + '@' + dbHostString
debugDb('Connecting to database on ' + dbHostString)
mongoose.connect('mongodb://' + dbCompletePath)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => {
	debugDb('Connected to the database successfully!')
})

const User = require('./models').User
///////////////////////////////////////////////////////////

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
passport.use(new LocalStrategy(verifyCredentials))

passport.serializeUser(function(user, done) {
	done(null, user._id)
})

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

function verifyCredentials(username, password, done) {
	findUser(username, password, done, verifyPassword)
}

function findUser(username, password, done, callback) {
	User.findOne({'username': username}, 'username passwordHash', (err, user) => {
		if (err) {
			return console.error(err)
		}
		if (!user) {
			//debugApp('Username ' + username + ' not found!')
			return done(null, false, {
				message: 'Incorrect username or password'
			})
		} else {
			return callback(null, user, password, done)
		}
	})
}

function verifyPassword(err, user, password, done) {
	/// Always use hashed passwords and fixed time comparison
	bcrypt.compare(password, user.passwordHash, (err, isValid) => {
		if (err) {
			return done(err)
		}
		if (!isValid) {
			//debugApp('The password ' + password + ' is invalid for user ' + user.username)
			return done(null, false, {
				message: 'Incorrect username or password.'
			})
		}
		//debugApp('The password ' + password + ' is valid for user ' + user.username)
		return done(null, user)
	})
}