const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const debugAuth = require('debug')('congressweb:auth')

function verifyCredentials(email, password, done) {
	findUser(email, password, done, verifyPassword)
}

function findUser(email, password, done, callback) {
	User.findOne({'authData.email': email}, 'authData.email authData.passwordHash', (err, user) => {
		if (err) {
			return console.error(err)
		}
		if (!user) {
			debugAuth('email ' + email + ' not found!')
			return done(null, false, {
				message: 'Incorrect email or password'
			})
		} else {
			debugAuth('Verifying password ' + password + ' for email ' + email)
			return callback(null, user, password, done)
		}
	})
}

function verifyPassword(err, user, password, done) {
	/// Always use hashed passwords and fixed time comparison
	bcrypt.compare(password, user.authData.passwordHash, (err, isValid) => {
		if (err) {
			return done(err)
		}
		if (!isValid) {
			debugAuth('The password ' + password + ' is invalid for user ' + user.authData.email)
			return done(null, false, {
				message: 'Incorrect email or password.'
			})
		}
		debugAuth('The password ' + password + ' is valid for user ' + user.authData.email)
		return done(null, user)
	})
}

module.exports = verifyCredentials