const express = require('express')
const router = express.Router()
const checkOrigin = require('../middleware/origin')
const { createItem, getItems } = require('../controlles/notification')

router.post('/', checkOrigin, createItem)

router.get('/', checkOrigin, getItems)


module.exports = router