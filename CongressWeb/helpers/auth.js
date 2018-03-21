const bcrypt = require('bcrypt')
const User = require('../models/User.js')

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

module.exports = verifyCredentials