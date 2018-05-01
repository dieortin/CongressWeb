const express = require('express')
const router = express.Router()
const debugViewAbstract = require('debug')('congressweb:viewAbstract')

const Participant = require('../models/Participant')

router.get('/:id', (req, res) => {
	req.app.locals.renderingOptions.title = 'Approval'
	Participant.findById(req.params.id, (err, participant) => {
		if (err) {
			debugViewAbstract(`Error while attempting to view abstract ${req.params.id}`)
			res.statusCode = 500
			res.end()
			return
		}
		debugViewAbstract(`Showing abstract ${req.params.id}`)
		res.app.locals.renderingOptions.title = participant.talk.title
		res.app.locals.renderingOptions.talk = participant.talk
		res.render('abstract', res.app.locals.renderingOptions)
	})
})

module.exports = router