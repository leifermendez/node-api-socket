const { httpError } = require('../helpers/handleError')
const leadsModel = require('../models/leads')
const leadsLogModel = require('../models/userLog')
const groupModel = require('../models/group')
const groupLogModel = require('../models/groupLog')
const accountModel = require('../models/accounts')

const getItems = async (req, res) => {
    try {

        //Leads
        const listLeads = {
            data: await leadsModel.find({}, null, {
                sort: { updatedAt: -1 }, limit: 15
            }),
            total: await leadsModel.countDocuments()
        }

        //Messages

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

        //Groups


        const listGroups = {
            data: await groupModel.find({}, null, {
                sort: { updatedAt: -1 }, limit: 15
            }),
            total: await groupModel.countDocuments()
        }

        //LogGroups
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

        //Account
        const accounts = {
            data: await accountModel.find({}, null, {
                sort: { updatedAt: -1 }, limit: 15
            }),
            total: await accountModel.countDocuments()
        }

        const data = {
            listLeads,
            listLogLeads,
            listGroups,
            listLogGroups,
            accounts
        }
        res.send({ data })
    } catch (e) {
        httpError(res, e)
    }
}

const getItem = (req, res) => {

}

const createItem = async (req, res) => {
    try {
        const { name, age, email } = req.body
        const resDetail = await userModel.create({
            name, age, email
        })
        res.send({ data: resDetail })
    } catch (e) {
        httpError(res, e)
    }
}


const updateItem = (req, res) => {

}

const deleteItem = (req, res) => {

}

module.exports = { getItem, getItems, deleteItem, createItem, updateItem }