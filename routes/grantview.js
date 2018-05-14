const express = require('express')
const router = express.Router()
const debugViewAbstract = require('debug')('congressweb:viewAbstract')

const Participant = require('../models/Participant')

router.get('/:id', (req, res) => {
	req.app.locals.renderingOptions.title = 'Grant explanation'
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugViewAbstract(`Error while attempting to view grant explanation ${req.params.id}`)
			res.statusCode = 500
			res.end()
			return
		}
		debugViewAbstract(`Showing grant explanation ${req.params.id}`)
		res.app.locals.renderingOptions.name = participant.personalData.firstName
		res.app.locals.renderingOptions.explanation = participant.grant.explanation
		res.render('grantview', res.app.locals.renderingOptions)
	})
})

module.exports = router