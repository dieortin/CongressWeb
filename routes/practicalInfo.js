const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Practical information'
	res.render('practicalInfo', req.app.locals.renderingOptions)
})