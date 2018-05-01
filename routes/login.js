var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('admin')
	} else {
		req.app.locals.renderingOptions.title = 'Login'
		req.app.locals.renderingOptions.error = req.flash('error')
		res.render('login', req.app.locals.renderingOptions)
	}
})

module.exports = router
