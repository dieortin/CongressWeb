var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	if (req.user) {
		res.render('index', { title: 'Homepage', user: req.user.personalData, headerImage: true})
	} else {
		res.render('index', { title: 'Homepage', headerImage: true})
	}
})

module.exports = router
