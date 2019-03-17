function addRenderingData(req, res, next) {
	// Add an empty renderingOptions object
	req.app.locals.renderingOptions = {}

	// Add the mount path and the static mode to the information passed to the views
	req.app.locals.renderingOptions.appMountPath = req.app.mountPath
	req.app.locals.renderingOptions.staticMode = req.app.staticMode

	// Enable/disable registrations
	const openingDateString = process.env.REGISTRATION_OPENING
	const closingDateString = process.env.REGISTRATION_CLOSING
	if (!openingDateString) {
		throw new new Error('No registration opening date present on environment')
	}
	const openingDate = new Date(openingDateString)
	const closingDate = new Date(closingDateString)
	const today = new Date()
	if (today > openingDate && today <= closingDate) {
		req.app.locals.renderingOptions.registrationEnabled = true
	}

	// Add user data to the renderingOptions if the user is logged in
	if (req.isAuthenticated()) {
		req.app.locals.renderingOptions.user = req.user.username
	}
	next()
}

module.exports = addRenderingData