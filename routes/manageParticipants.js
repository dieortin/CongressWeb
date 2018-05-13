const express = require('express')
//const bcrypt = require('bcrypt')
const router = express.Router()
const debugParticipants = require('debug')('congressweb:participantApproval')
require('dotenv').config()

const Participant = require('../models/Participant')

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Approval'
	Participant.find({
		'approved': true
	}).sort({
		'personalData.firstName': 'asc'
	}).find((err, participants) => {
		if (err) {
			debugParticipants('Error while searching for approved participants')
		}
		req.app.locals.renderingOptions.participants = []
		for (var i = 0; i < participants.length; i++) {
			const arrival = new Date(participants[i].dateOf.arrival)
			const departure = new Date(participants[i].dateOf.departure)
			const pd = participants[i].personalData
			const af = participants[i].affiliation

			const p = {}
			p.id = participants[i].id
			p.fullName = pd.title + ' ' + pd.firstName + ' ' + pd.familyName
			p.phoneNumber = pd.phoneNumber
			p.affName = af.name
			p.affAddress = af.address
			p.arrival = arrival.toDateString()
			p.departure = departure.toDateString()
			p.hasTalk = participants[i].talk.exists
			p.talkTitle = participants[i].talk.title

			req.app.locals.renderingOptions.participants.push(p)
		}
		res.render('manageParticipants', req.app.locals.renderingOptions)
	})
})

router.post('/unapprove/:id', (req, res) => {
	debugParticipants(`Unapproving participant with id ${req.params.id}`)
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugParticipants(`Error while searching for participant ${req.params.id}`)
		}
		participant.approved = false
		participant.save((err) => {
			if (err) {
				debugParticipants(`Error while saving updated participant ${req.params.id}`)
				res.statusCode = 500
				res.end()
			} else {
				res.statusCode = 200
				res.write('Participant approved')
				res.end()
			}
		})
	})
})

module.exports = router