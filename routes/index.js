const express = require('express')
const router = express.Router()

function renderIndex(req, res) {
	req.app.locals.renderingOptions.title = 'Homepage'
	req.app.locals.renderingOptions.headerImage = true
	res.render('index', req.app.locals.renderingOptions)
}

/* GET home page. */
router.get('/', renderIndex)
router.get('/index', renderIndex)

module.exports = router
