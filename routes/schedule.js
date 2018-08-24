const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Schedule'
	res.render('schedule', req.app.locals.renderingOptions)
})

module.exports = router