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
	//console.log('Request body: %j', req.body)

	debugRegistration(`New Participant registration attempt: ${req.body.firstName} ${req.body.familyName}`)

	var newParticipant
	var participantObj = {
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
	}

	if (req.body.talkExists == 'on') {
		participantObj.talk = {
			exists: true,
			title: req.body.talkTitle,
			abstract: req.body.talkAbstract,
			duration: req.body.talkDuration,
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
				to: 'dieortin@gmail.com', // list of receivers
				subject: 'New registration ✔', // Subject line
				text: 'Hello world?', // plain text body
				html: `<h1>New participant registered</h1>
						<div>New participant: ${newParticipant.personalData.firstName}</div>
						<h3>New data to be added to the emails soon</h3>` // html body
			}

			require('../helpers/setupNodemailer').transporter().sendMail(mailOptions, (error, info) => {
				if (error) {
					return debugRegistration(error)
				}
				debugRegistration('Message sent: %s', info.messageId)
				// Preview only available when sending through an Ethereal account
				debugRegistration('Preview URL: %s', nodemailer.getTestMessageUrl(info))

				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
				// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
			})
		}
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