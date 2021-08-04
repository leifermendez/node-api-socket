const { httpError } = require('../helpers/handleError')
const { pushSocket } = require('../services/socket')

const createItem = async (req, res) => {
    try {
        const { title, message, extra, type = 'success' } = req.body
        pushSocket({ title, message, extra, type })
        res.send({ data: { title, message, extra } })
    } catch (e) {
        httpError(res, e)
    }
}

module.exports = { createItem }