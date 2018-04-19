var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	req.app.locals.renderingOptions.title = 'Restricted area'
	if (req.isAuthenticated()) {
		res.render('restricted', req.app.locals.renderingOptions)
	} else {
		res.redirect(/*403, */'back')
	}
})

module.exports = router
