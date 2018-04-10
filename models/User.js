const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	authData: {
		email: {
			type: String,
			required: true,
			unique: true
		},
		passwordHash: {
			type: String,
			required: true
		}
	},
	personalData: {
		title: {
			type: String,
			enum: ['Dr.', 'Prof.', 'PhD Student']
		},
		firstName: {
			type: String,
			required: true
		},
		familyName: {
			type: String,
			required: true
		},
		phoneNumber: {
			type: Number,
			required: true
		}

	},
	affiliation: {
		name: {
			type: String,
			required: true
		},
		address: {
			type: String,
			required: true
		}
	},
	dateOf: {
		arrival: {
			type: Date,
			required: true
		},
		departure: {
			type: Date,
			required: true
		}
	},
	talk: {
		exists: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			required: false //TODO: should be required when talk exists
		},
		abstract: {
			type: String,
			required: false //TODO: should be required when talk exists
		},
		duration: Number,
		aditionalInfo: String
	},
	scholarship: {
		doesApply: {
			type: Boolean,
			required: true,
			default: false
		},

	}
})

const User = mongoose.model('User', userSchema)

module.exports = User