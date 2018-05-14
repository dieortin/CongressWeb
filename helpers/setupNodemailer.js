const nodemailer = require('nodemailer')
require('dotenv').config()

let transporter = null

function setupNodemailer() {
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

	// Generate test SMTP service account from ethereal.email
	//nodemailer.createTestAccount((err, account) => {
	// create reusable transporter object using the default SMTP transport
	transporter = nodemailer.createTransport(options)
	//})
}

function getTransporter() {
	return transporter
}

module.exports = {
	setup: setupNodemailer,
	transporter: getTransporter
}