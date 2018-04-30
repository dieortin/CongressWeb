const express = require('express')
//const bcrypt = require('bcrypt')
const router = express.Router()
const debugParticipants = require('debug')('congressweb:participants')
require('dotenv').config()
const querystring = require('querystring')

const APP_MOUNT_DIR = process.env.APP_MOUNT_DIR

const Participant = require('../models/Participant')

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Participants'
	Participant.find({
		'approved': true
	}).sort({
		'personalData.firstName': 'asc'
	}).find((err, participants) => {
		if (err) {
			debugParticipants("Error while searching for participants")
		}
		req.app.locals.renderingOptions.participants = participants
		res.render('participants', req.app.locals.renderingOptions)
	})
})

module.exports = router