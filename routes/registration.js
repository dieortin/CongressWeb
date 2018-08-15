const express = require('express')
const router = express.Router()
const debugRegistration = require('debug')('congressweb:registration')
require('dotenv').config()
const request = require('request')
const querystring = require('querystring')
const mailer = require('pug-mailer')

const APP_MOUNT_DIR = process.env.APP_MOUNT_DIR

const Participant = require('../models/Participant')

router.get('/', isAuthenticated, isRegistrationOpen, (req, res) => {
	//debugRegistration('Rendering page')
	req.app.locals.renderingOptions.title = 'Register'
	res.render('registration', req.app.locals.renderingOptions)
})

router.get('/:code', isRegistrationOpen, function(req, res) {
	req.app.locals.renderingOptions.title = 'Register'
	if (req.params.code == 'recaptcha') {
		req.app.locals.renderingOptions.error = 'Failed captcha verification'
	} else {
		req.app.locals.renderingOptions.error = req.params.code
	}
	res.render('registration', req.app.locals.renderingOptions)
})

router.post('/', isRegistrationOpen, function(req, res, next) {
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
	//console.log('Request body: %j', req.body)

	debugRegistration(`New Participant registration attempt: ${req.body.firstName} ${req.body.familyName}`)

	var newParticipant
	var participantObj = {
		personalData: {
			title: req.body.title,
			firstName: req.body.firstName,
			familyName: req.body.familyName,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email
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
	}

	if (req.body.talkExists == 'on') {
		participantObj.talk = {
			exists: true,
			title: req.body.talkTitle,
			abstract: req.body.talkAbstract,
			additionalInfo: req.body.talkAdditionalInfo
		}
	}
	if (req.body.grantApplies == 'on') {
		participantObj.grant = {
			doesApply: true,
			explanation: req.body.grantExplanation
		}
	}

	newParticipant = new Participant(participantObj)

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

			const destinataries = process.env.MAIL_DESTINATARIES
			if (destinataries == null) {
				return new Error('Mail destinataries not set!')
			}
			// setup email data with unicode symbols
			let mailOptions = {
				from: '"EREP\'18 Registration"  <registration@erep2018.com>', // sender address
				to: destinataries, // list of receivers
				//subject: 'New registration ✔', // Subject line
				template: 'newRegistration',
				data: {
					participant: newParticipant
				}
			}

			var mailSubject = '[REGISTRATION'
			if (newParticipant.talk.exists) {
				mailSubject += '+TALK'
			}
			if (newParticipant.grant.doesApply) {
				mailSubject += '+GRANT'
			}
			mailSubject += ']'
			mailOptions.subject = mailSubject

			mailer.send(mailOptions)
				.then(response => debugRegistration('Email sent!'))
				.catch(err => debugRegistration('Error! ' + err))
		}
	})


})

/**
 * Redirects the user to the administration page if they're
 * already authenticated
 *
 * @param      {Object}    req     The request
 * @param      {Object}    res     The response
 * @param      {Function}  next    The callback
 */
function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect(APP_MOUNT_DIR + '/admin')
	} else {
		next()
	}
}

/**
 * Rejects the request with a 404 if registration is closed
 *
 * @param      {Object}    req     The request
 * @param      {Object}    res     The response
 * @param      {Function}  next    The callback
 */
function isRegistrationOpen(req, res, next) {
	const openingDateString = process.env.REGISTRATION_OPENING
	const closingDateString = process.env.REGISTRATION_CLOSING
	if (!openingDateString) {
		throw new new Error('No registration opening date present on environment')
	}
	const openingDate = new Date(openingDateString)
	const closingDate = new Date(closingDateString)
	const today = new Date()

	if (today > openingDate && today <= closingDate) {
		//debugRegistration('Registration open')
		next()
	} else {
		// Render a 404, should be refactored to a function that's also used 
		// in the app.js handler at the end of the middleware stack
		var err = new Error('Not Found')
		err.status = 404
		res.statusCode = 404
		req.app.locals.renderingOptions.title = '404'
		res.render('404', req.app.locals.renderingOptions)
	}
}

module.exports = router