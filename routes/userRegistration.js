const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const userRegistration = require('debug')('congressweb:userRegistration')
require('dotenv').config()
const APP_MOUNT_DIR = process.env.APP_MOUNT_DIR

const User = require('../models/User')

router.get('/', isAuthenticated, (req, res) => {
	req.app.locals.renderingOptions.title = 'Register'
	res.render('userRegistration', req.app.locals.renderingOptions)
})

router.post('/', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	userRegistration(`New User registration attempt: username:${username} pass:${password}`)

	res.redirect(APP_MOUNT_DIR + '/login')

	bcrypt.hash(password, 10, function(err, hash) {
		const newUser = new User({
			username: username,
			passwordHash: hash
		})
		newUser.save((err /*, newUser*/ ) => {
			if (err) {
				return console.error(err)
			}
			userRegistration(`New User registered: username:${username} pass:${password}`)
		})
	})
})

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect(APP_MOUNT_DIR + '/admin')
	} else {
		next()
	}
}

module.exports = router