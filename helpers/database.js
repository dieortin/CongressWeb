const debugDb = require('debug')('congressweb:db')
const mongoose = require('mongoose')
require('dotenv').config()

const dbopt = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	pass: process.env.DATABASE_PASSWORD,
	port: process.env.DATABASE_PORT,
	path: process.env.DATABASE_PATH
}
const dbCredString = dbopt.user + ':' + dbopt.pass
const dbHostString = dbopt.host + ':' + dbopt.port + '/' + dbopt.path
const dbCompletePath =  dbCredString + '@' + dbHostString

var db = null

exports.connect = function() {
	debugDb('Connecting to database on ' + dbHostString)
	mongoose.connect('mongodb://' + dbCompletePath)
	db = mongoose.connection
	db.on('error', console.error.bind(console, 'connection error: '))
	db.once('open', () => {
		debugDb('Connected to the database successfully!')
	})
}

exports.get = function() {
	return db
}

exports.disconnect = function(done) {
	if (db) {
		db.close((err) => {
			done(err)
		})
	}
}