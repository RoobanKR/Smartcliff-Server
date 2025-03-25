const express = require('express')
const router = express.Router()

const { userAuth } = require('../../middlewares/userAuth.js')
const { userRole } = require('../../middlewares/userRole.js')
const { createShine, getAllShine, getShineById, updateShine, deleteShine } = require('../../controllers/about/shine.js')

router.post('/create/about/shine',createShine)
router.get('/getAll/about/shine', getAllShine)
router.get('/getById/about/shine/:id',  getShineById)
router.put('/update/about/shine/:id',updateShine)
router.delete('/delete/about/shine/:id', deleteShine)

module.exports = router
