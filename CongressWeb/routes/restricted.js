var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('restricted', { username: req.user.username })
	} else {
		res.redirect(/*403, */'back')
	}
})

module.exports = router
