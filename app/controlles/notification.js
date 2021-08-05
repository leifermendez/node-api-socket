const { httpError } = require('../helpers/handleError')
const { pushSocket } = require('../services/socket')
const leadsModel = require('../models/leads')
const leadsLogModel = require('../models/userLog')
const groupModel = require('../models/group')
const groupLogModel = require('../models/groupLog')


const getTotalLeads = async () => {
    //Leads
    const listLeads = {
        data: await leadsModel.find({}, null, {
            sort: { updatedAt: -1 }, limit: 15
        }),
        total: await leadsModel.countDocuments()
    }

    return listLeads
}

const getMessagesLeads = async () => {

    const dataLogMessage = await leadsLogModel.aggregate([
        {
            $lookup: {
                from: 'ads',
                localField: 'adsId',
                foreignField: '_id',
                as: 'messageLink'
            },
        },
        {
            $lookup: {
                from: 'leads',
                localField: 'uuid',
                foreignField: 'uuid',
                as: 'leadUser'
            }
        },
        {
            $sort: { updatedAt: -1 }

        },
        {
            $unwind: '$messageLink'
        },
        {
            $unwind: '$leadUser'
        },
        {
            $limit: 15
        }
    ])


    const listLogLeads = {
        data: dataLogMessage,
        total: await leadsLogModel.countDocuments()
    }

    return listLogLeads
}

const getTotalGroup = async () => {

    const listGroups = {
        data: await groupModel.find({}, null, {
            sort: { updatedAt: -1 }, limit: 15
        }),
        total: await groupModel.countDocuments()
    }

    return listGroups
}

const getLogGroup = async () => {

    const dataLogGroup = await groupLogModel.aggregate([
        {
            $lookup: {
                from: 'groups',
                localField: 'idGroup',
                foreignField: 'idGroup',
                as: 'asGroup'
            },
        },
        {
            $unwind: '$asGroup'
        },
        {
            $sort: { updatedAt: -1 }

        },
        {
            $limit: 15
        }
    ])

    const listLogGroups = {
        data: dataLogGroup,
        total: await groupLogModel.countDocuments()
    }
    return listLogGroups
}

const createItem = async (req, res) => {
    try {
        const { title, message, extra, type = 'success', source = '' } = req.body
        if (source === 'total_leads') {
            const data = {
                source,
                list: await getTotalLeads()
            }
            const dataPush = {
                title,
                message,
                type,
                extra: data
            }
            pushSocket(dataPush)
            res.send({ data })
            return
        }

        let data = {}
        let dataPush = {
            title,
            message,
            type,
        }

        if (source === 'total_message_leads') {
            data = {
                source,
                list: await getMessagesLeads()
            }
            const dataPush = {
                title,
                message,
                type,
                extra: data
            }
            pushSocket(dataPush)
            res.send({ data })
            return
        }

        if (source === 'total_groups') {
            data = {
                source,
                list: await getTotalGroup()
            }
            const dataPush = {
                title,
                message,
                type,
                extra: data
            }
            pushSocket(dataPush)
            res.send({ data })
            return
        }

        if (source === 'total_group_log') {
            data = {
                source,
                list: await getLogGroup()
            }
            const dataPush = {
                title,
                message,
                type,
                extra: data
            }
            pushSocket(dataPush)
            res.send({ data })
            return
        }
        pushSocket(dataPush)
        res.send({ data })
    } catch (e) {
        httpError(res, e)
    }
}

module.exports = { createItem }