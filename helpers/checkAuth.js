function checkAuth(req, res, next) {
	if (req.isAuthenticated()) {
		next()
	} else {
		res.redirect(401, 'login')
	}
}

module.exports = checkAuth
