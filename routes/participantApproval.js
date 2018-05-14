const express = require('express')
	//const bcrypt = require('bcrypt')
const router = express.Router()
const debugParticipants = require('debug')('congressweb:participantApproval')
require('dotenv').config()
const mailer = require('pug-mailer')

const Participant = require('../models/Participant')

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Approval'
	Participant.find({
		'approved': false
	}).sort({
		'personalData.firstName': 'asc'
	}).find((err, participants) => {
		if (err) {
			debugParticipants('Error while searching for unapproved participants')
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
			p.appliesGrant = participants[i].grant.doesApply
			p.additionalInfo = participants[i].additionalInfo
			p.email = pd.email

			req.app.locals.renderingOptions.participants.push(p)
		}
		res.render('participantApproval', req.app.locals.renderingOptions)
	})
})

router.post('/approve/:id', (req, res) => {
	debugParticipants(`Approving participant with id ${req.params.id}`)
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugParticipants(`Error while searching for participant ${req.params.id}`)
			debugParticipants(err)
		}
		participant.approved = true
		participant.save((err) => {
			if (err) {
				debugParticipants(`Error while saving updated participant ${req.params.id}`)
				debugParticipants(err)
				res.statusCode = 500
				res.end()
			} else {
				res.statusCode = 200
				res.write('Participant approved')
				res.end()

				// Send a mail to the approved user telling him his registration is successful
				let mailOptions = {
					from: '"EREP\'18 Registration"  <registration@erep2018.com>', // sender address
					to: participant.personalData.email, // list of receivers
					subject: '[EREP\'18] Registration approved! ✔', // Subject line
					template: 'approvedParticipant',
					data: {
						participant: participant
					}
				}

				mailer.send(mailOptions)
					.then(response => debugParticipants(`Email sent to ${mailOptions.to}!`))
					.catch(err => debugParticipants('Error! ' + err))
			}
		})
	})
})

router.post('/reject/:id', (req, res) => {
	debugParticipants(`Rejecting participant with id ${req.params.id}`)
	Participant.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			debugParticipants(`Error while searching for participant ${req.params.id}`)
			debugParticipants(err)
			res.statusCode = 500
			res.end()
		} else {
			res.statusCode = 200
			res.write('Participant rejected')
			res.end()
		}
	})
})

router.post('/revoke/:id', (req, res) => {
	debugParticipants(`Revoking participant with id ${req.params.id}`)
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugParticipants(`Error while searching for participant ${req.params.id}`)
			debugParticipants(err)
		}
		participant.approved = false
		participant.save((err) => {
			if (err) {
				debugParticipants(`Error while saving updated participant ${req.params.id}`)
				res.statusCode = 500
				res.end()
			} else {
				res.statusCode = 200
				res.write('Participant revoked')
				res.end()
			}
		})
	})
})

module.exports = router