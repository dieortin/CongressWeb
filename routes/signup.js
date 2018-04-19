const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
//const https = require('https')
const debugSignup = require('debug')('congressweb:signup')
require('dotenv').config()
const request = require('request')
const querystring = require('querystring')

const User = require('../models/User')

router.get('/', isAuthenticated, (req, res) => {
	req.app.locals.renderingOptions.title = 'Register'
	res.render('signup', req.app.locals.renderingOptions)
})

router.get('/:code', function(req, res) {
	req.app.locals.renderingOptions.title = 'Register'
	if (req.params.code == 'recaptcha') {
		req.app.locals.renderingOptions.error = 'Failed captcha verification'
	} else {
		req.app.locals.renderingOptions.error = req.params.code
	}
	res.render('signup', req.app.locals.renderingOptions)
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
	const email = req.body.email
	const password = req.body.password
	const title = req.body.title
	const firstName = req.body.firstName
	const familyName = req.body.familyName
	const phoneNumber = req.body.phoneNumber
	const affiliationName = req.body.affiliationName
	const affiliationAddress = req.body.affiliationAddress
	const arrivalDate = req.body.arrivalDate
	const departureDate = req.body.departureDate

	console.log('Creating new user with email ' + email + ' and password ' + password)

	bcrypt.hash(password, 10, function(err, hash) {
		const newUser = new User({
			authData: {
				email: email,
				passwordHash: hash
			},
			personalData: {
				title: title,
				firstName: firstName,
				familyName: familyName,
				phoneNumber: phoneNumber
			},
			affiliation: {
				name: affiliationName,
				address: affiliationAddress
			},
			dateOf: {
				arrival: arrivalDate,
				departure: departureDate
			}
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