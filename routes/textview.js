const express = require('express')
const router = express.Router()
const debugTextView = require('debug')('congressweb:textView')

const Participant = require('../models/Participant')

router.get('/grant/:id', (req, res) => {
	req.app.locals.renderingOptions.title = 'Grant explanation'
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugTextView(`Error while attempting to view grant explanation ${req.params.id}`)
			res.statusCode = 500
			res.end()
			return
		}
		debugTextView(`Showing grant explanation ${req.params.id}`)
		res.app.locals.renderingOptions.textTitle = 'grant explanation'
		res.app.locals.renderingOptions.name = participant.personalData.firstName
		res.app.locals.renderingOptions.text = participant.grant.explanation
		res.render('textview', res.app.locals.renderingOptions)
	})
})

router.get('/additionalInfo/:id', (req, res) => {
	req.app.locals.renderingOptions.title = 'Additional information'
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugTextView(`Error while attempting to view additional information for ${req.params.id}`)
			res.statusCode = 500
			res.end()
			return
		}
		debugTextView(`Showing additional information ${req.params.id}`)
		res.app.locals.renderingOptions.textTitle = 'additional information'
		res.app.locals.renderingOptions.name = participant.personalData.firstName
		res.app.locals.renderingOptions.text = participant.additionalInfo
		res.render('textview', res.app.locals.renderingOptions)
	})
})

module.exports = router