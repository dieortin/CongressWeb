const express = require('express')
//const bcrypt = require('bcrypt')
const router = express.Router()
const debugRegistration = require('debug')('congressweb:registration')
require('dotenv').config()
const request = require('request')
const querystring = require('querystring')

const APP_MOUNT_DIR = process.env.APP_MOUNT_DIR

const Participant = require('../models/Participant')

router.get('/', isAuthenticated, (req, res) => {
	req.app.locals.renderingOptions.title = 'Register'
	res.render('registration', req.app.locals.renderingOptions)
})

router.get('/:code', function(req, res) {
	req.app.locals.renderingOptions.title = 'Register'
	if (req.params.code == 'recaptcha') {
		req.app.locals.renderingOptions.error = 'Failed captcha verification'
	} else {
		req.app.locals.renderingOptions.error = req.params.code
	}
	res.render('registration', req.app.locals.renderingOptions)
})

router.post('/', function(req, res, next) {
	const recaptcha = req.body['g-recaptcha-response']

	const body = {
		secret: process.env.RECAPTCHA_SECRET,
		response: recaptcha,
		remoteip: req.ip
	}

	const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?' + querystring.stringify(body)

	request(verificationURL, (err, googleResponse, googleBody) => {
		googleBody = JSON.parse(googleBody)
		if (googleBody.success) {
			next()
		} else {
			res.redirect(APP_MOUNT_DIR + '/registration/recaptcha')
		}
	})
}, function(req, res) {
	const title = req.body.title
	const firstName = req.body.firstName
	const familyName = req.body.familyName
	const phoneNumber = req.body.phoneNumber
	const affiliationName = req.body.affiliationName
	const affiliationAddress = req.body.affiliationAddress
	const arrivalDate = req.body.arrivalDate
	const departureDate = req.body.departureDate

	//console.log("Request body: %j", req.body)

	debugRegistration(`New Participant registration attempt: ${firstName} ${familyName}`)

	const newParticipant = new Participant({
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
	newParticipant.save((err /*, newUser*/ ) => {
		if (err) {
			return console.error(err)
		}
		debugRegistration(`New Participant registered: ${firstName} ${familyName}`)
	})

	//res.redirect(APP_MOUNT_DIR + '/login')
	res.render('registration-success', req.app.locals.renderingOptions)

	// CODE FOR HANDLING AUTHENTICATED USER REGISTRATION
	// bcrypt.hash(password, 10, function(err, hash) {
	// 	const newParticipant = new Participant({
	// 		authData: {
	// 			email: email,
	// 			passwordHash: hash
	// 		},
	// 		personalData: {
	// 			title: title,
	// 			firstName: firstName,
	// 			familyName: familyName,
	// 			phoneNumber: phoneNumber
	// 		},
	// 		affiliation: {
	// 			name: affiliationName,
	// 			address: affiliationAddress
	// 		},
	// 		dateOf: {
	// 			arrival: arrivalDate,
	// 			departure: departureDate
	// 		}
	// 	})
	// 	newUser.save((err/*, newUser*/) => {
	// 		if (err) {
	// 			return console.error(err)
	// 		}
	// 	})
	// })
})

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect(APP_MOUNT_DIR + '/restricted')
	} else {
		next()
	}
}

module.exports = router