const express = require('express')
const router = express.Router()

const { userAuth } = require('../../middlewares/userAuth.js')
const { userRole } = require('../../middlewares/userRole.js')
const { createWCU, getAllWCU, getWCUById, editWCUById, deleteWCUById } = require('../../controllers/about/wcu.js')

router.post('/create/wcu',createWCU)
router.get('/getAll/wcu', getAllWCU)
router.get('/getById/wcu/:id',  getWCUById)
router.put('/update/wcu/:id',editWCUById)
router.delete('/delete/wcu/:id', deleteWCUById)

module.exports = router
