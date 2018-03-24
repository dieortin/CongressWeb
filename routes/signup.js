const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const https = require('https')
const debugSignup = require('debug')('congressweb:signup')
require('dotenv').config()
const request = require('request')
const querystring = require('querystring')

const User = require('../models/User')

router.get('/', isAuthenticated, (req, res) => {
	res.render('signup', { title: 'Register' })
})

router.get('/:code', function(req, res) {
	if (req.params.code == 'recaptcha') {
		res.render('signup', { title: 'Register', error: 'Failed captcha verification' })
	} else {
		res.render('signup', { title: 'Register', error: code })
	}
})

router.post('/', function(req, res, next) {
	const recaptcha = req.body['g-recaptcha-response']

	const body = {
		secret: process.env.RECAPTCHA_SECRET,
		response: recaptcha,
		remoteip: req.ip
	}

	const verificationURL =  'https://www.google.com/recaptcha/api/siteverify?' +  querystring.stringify(body)

	request(verificationURL, (err, googleResponse, googleBody) => {
		googleBody = JSON.parse(googleBody)
		if (googleBody.success) {
			next()
		} else {
			res.redirect('/signup/recaptcha')
		}
	})
}, function(req, res) {
	const username = req.body.username
	const password = req.body.password

	console.log('Creating new user with username ' + username + ' and password ' + password)

	bcrypt.hash(password, 10, function(err, hash) {
		const newUser = new User({
			username: username,
			passwordHash: hash
		})
		newUser.save((err/*, newUser*/) => {
			if (err) {
				return console.error(err)
			}
		})
	})

	res.redirect('/login')
})

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect('/restricted')
	} else {
		next()
	}
}

module.exports = router