const mongoose = require('mongoose')

const participantSchema = mongoose.Schema({
	approved: {
		type: Boolean,
		default: false
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
			type: String,
			required: true
		},
		email: {
			type: String,
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
		additionalInfo: String
	},
	grant: {
		doesApply: {
			type: Boolean,
			required: true,
			default: false
		},
		explanation: {
			type: String,
			required: false
		}

	},
	additionalInfo: {
		type: String,
		required: false
	}
})

const Participant = mongoose.model('Participant', participantSchema)

module.exports = Participant