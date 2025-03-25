const express = require('express')
const router = express.Router()
const { userAuth } = require('../../middlewares/userAuth.js')
const { userRole } = require('../../middlewares/userRole.js')
const { createVisionMision, getAllVisionMision, getVisionMisionById, editVisionMisionById, deleteVisionMisionById } = require('../../controllers/about/vision-mision.js')

router.post('/create/about/vision-mission',userAuth,createVisionMision)
router.get('/getAll/about/vision-mission', getAllVisionMision)
router.get('/getById/about/vision-mission/:id',  getVisionMisionById)
router.put('/update/about/vision-mission/:id',userAuth,editVisionMisionById)
router.delete('/delete/about/vision-mission/:id', deleteVisionMisionById)

module.exports = router
