var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Spanish-Portuguese Relativity Meeting', headerImage: true})
})

module.exports = router
