const express = require('express')
const router = express.Router()
const checkOrigin = require('../middleware/origin')
const { getItems } = require('../controlles/dashboard')

router.get('/', checkOrigin, getItems)


module.exports = router