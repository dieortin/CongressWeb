const mailer = require('pug-mailer')
require('dotenv').config()

function setupMailer() {
	const options = {
		service: process.env.MAIL_SERVICE,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD
		}
	}

	// Check for undefined properties in the mail options
	for (let prop in options) {
		if (prop == null) {
			return new Error('Not all mail options are defined')
		}
	}
	for (let prop in options.auth) {
		if (prop == null) {
			return new Error('Not all mail auth options are defined')
		}
	}
	mailer.init(options)
}

module.exports = setupMailer