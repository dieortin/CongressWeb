const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	req.app.locals.renderingOptions.title = 'Administration'
	res.render('admin', req.app.locals.renderingOptions)
})

module.exports = router