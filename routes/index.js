const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	req.app.locals.renderingOptions.title = 'Homepage'
	req.app.locals.renderingOptions.headerImage = true
	res.render('index', req.app.locals.renderingOptions)
})

module.exports = router
