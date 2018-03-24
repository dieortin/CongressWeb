var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/restricted')
	} else {
		res.render('login', { title: 'Login' })
	}
})

module.exports = router
