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
		'personalData.lastName': 'asc'
	}).find((err, participants) => {
		if (err) {
			debugParticipants('Error while searching for participants')
		}
		req.app.locals.renderingOptions.participants = participants
		res.render('participants', req.app.locals.renderingOptions)
	})
})

module.exports = router