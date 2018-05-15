const express = require('express')
const router = express.Router()
const debugParticipants = require('debug')('congressweb:participants')
require('dotenv').config()

const Participant = require('../models/Participant')

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Participants'
	Participant.find({
		'approved': true
	}).sort({
		'personalData.familyName': 1 // Sort by family name in descending order
	}).exec((err, participants) => {
		if (err) {
			debugParticipants('Error while searching for participants')
		}
		// TODO: display an error page here
		req.app.locals.renderingOptions.participants = participants
		res.render('participants', req.app.locals.renderingOptions)
	})
})

module.exports = router