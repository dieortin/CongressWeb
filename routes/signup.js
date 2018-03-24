var express = require('express')
var bcrypt = require('bcrypt')
var router = express.Router()

const User = require('../models/User')

/* GET home page. */
router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/restricted')
	} else {
		res.render('signup', {
			title: 'Register'
		})
	}
})

router.post('/', function(req, res) {
	const username = req.body.username
	const password = req.body.password

	console.log('Creating new user with username ' + username + ' and password ' + password)

	bcrypt.hash(password, 10, function(err, hash) {
		const newUser = new User({
			username: username,
			passwordHash: hash
		})
		newUser.save((err/*, newUser*/) => {
			if (err) {
				return console.error(err)
			}
		})
	})

	res.redirect('/login')
})

module.exports = router