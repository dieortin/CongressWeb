function addRenderingData(req, res, next) {
	// Add an empty renderingOptions object
	req.app.locals.renderingOptions = {}
	// Enable/disable registrations
	const openingDateString = process.env.REGISTRATION_OPENING
	if (!openingDateString) {
		throw new new Error('No registration opening date present on environment')
	}
	const openingDate = new Date(openingDateString)
	const today = new Date()
	if (today > openingDate) {
		req.app.locals.renderingOptions.registrationEnabled = true
	}

	// Add user data to the renderingOptions if the user is logged in
	if (req.isAuthenticated()) {
		req.app.locals.renderingOptions.user = req.user.personalData
	}
	next()
}

module.exports = addRenderingData