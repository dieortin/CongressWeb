const nodemailer = require('nodemailer')

let transporter = null

function setupNodemailer() {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	nodemailer.createTestAccount((err, account) => {
		// create reusable transporter object using the default SMTP transport
		transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass // generated ethereal password
			}
		})
	})
}

function getTransporter() {
	return transporter
}

module.exports = {
	setup: setupNodemailer,
	transporter: getTransporter
}