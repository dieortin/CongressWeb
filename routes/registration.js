const express = require('express')
const router = express.Router()
const debugRegistration = require('debug')('congressweb:registration')
require('dotenv').config()
const request = require('request')
const querystring = require('querystring')
const nodemailer = require('nodemailer')

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
	//console.log("Request body: %j", req.body)

	debugRegistration(`New Participant registration attempt: ${req.body.firstName} ${req.body.familyName}`)

	var newParticipant

	if (req.body.talkExists == 'on') {
		newParticipant = new Participant({
			personalData: {
				title: req.body.title,
				firstName: req.body.firstName,
				familyName: req.body.familyName,
				phoneNumber: req.body.phoneNumber
			},
			affiliation: {
				name: req.body.affiliationName,
				address: req.body.affiliationAddress
			},
			dateOf: {
				arrival: req.body.arrivalDate,
				departure: req.body.departureDate
			},
			talk: {
				exists: true,
				title: req.body.talkTitle,
				abstract: req.body.talkAbstract,
				duration: req.body.talkDuration,
				additionalInfo: req.body.talkAdditionalInfo
			},
			additionalInfo: req.body.additionalInfo
		})
	} else {
		newParticipant = new Participant({
			personalData: {
				title: req.body.title,
				firstName: req.body.firstName,
				familyName: req.body.familyName,
				phoneNumber: req.body.phoneNumber
			},
			affiliation: {
				name: req.body.affiliationName,
				address: req.body.affiliationAddress
			},
			dateOf: {
				arrival: req.body.arrivalDate,
				departure: req.body.departureDate
			},
			additionalInfo: req.body.additionalInfo
		})
	}

	newParticipant.save((err /*, newUser*/ ) => {
		if (err) {
			debugRegistration('New participant registration failed!')
			debugRegistration(err)
			req.app.locals.renderingOptions.title = 'Error!'
			req.app.locals.renderingOptions.success = false
			res.render('registration-result', req.app.locals.renderingOptions)
		} else {
			debugRegistration(`New Participant registered: ${req.body.firstName} ${req.body.familyName}`)
			req.app.locals.renderingOptions.title = 'Success!'
			req.app.locals.renderingOptions.success = true
			res.render('registration-result', req.app.locals.renderingOptions)
		}
	})

	
})

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect(APP_MOUNT_DIR + 'admin')
	} else {
		next()
	}
}

module.exports = router