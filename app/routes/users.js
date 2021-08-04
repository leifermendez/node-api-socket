const express = require('express')
const router = express.Router()
const checkOrigin = require('../middleware/origin')
const { cacheInit } = require('../middleware/cache')
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controlles/users')

//TODO: localhost/users/ --> LISTA
router.get('/', checkOrigin, cacheInit, getItems)

//TODO: localhost/users/:id --> DETALLE
router.get('/:id', checkOrigin, getItem)

router.post('/', checkOrigin, createItem)

router.patch('/:id', updateItem)

router.delete('/:id', deleteItem)


module.exports = router