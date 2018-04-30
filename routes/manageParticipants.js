const express = require('express')
//const bcrypt = require('bcrypt')
const router = express.Router()
const debugParticipants = require('debug')('congressweb:manageParticipants')
require('dotenv').config()
const querystring = require('querystring')

const APP_MOUNT_DIR = process.env.APP_MOUNT_DIR

const Participant = require('../models/Participant')

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Participants'
	Participant.find({
		'approved': false
	}).sort({
		'personalData.firstName': 'asc'
	}).find((err, participants) => {
		if (err) {
			debugParticipants("Error while searching for participants")
		}
		req.app.locals.renderingOptions.participants = participants
		res.render('manageParticipants', req.app.locals.renderingOptions)
	})
})

router.post('/approve/:id', (req, res) => {
	debugParticipants(`Approving participant with id ${req.params.id}`)
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugParticipants(`Error while searching for participant ${req.params.id}`)
		}
		participant.approved = true
		participant.save((err, updatedParticipant) => {
			if (err) {
				debugParticipants(`Error while saving updated participant ${req.params.id}`)
				res.statusCode = 500
				res.end()
			} else {
				res.statusCode = 200
				res.end('Approved participant')
			}
		})
	})
})

module.exports = router