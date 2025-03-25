const express = require('express')
const router = express.Router()

const { userAuth } = require('../../middlewares/userAuth.js')
const { userRole } = require('../../middlewares/userRole.js')
const { createYearlyService, getAllYearlyServices, getYearlyServiceById, updateYearlyService, deleteYearlyService } = require('../../controllers/about/yearlyService.js')

router.post('/create/about/yearly-services',createYearlyService)
router.get('/getAll/about/yearly-services', getAllYearlyServices)
router.get('/getById/about/yearly-services/:id',  getYearlyServiceById)
router.put('/update/about/yearly-services/:id',updateYearlyService)
router.delete('/delete/about/yearly-services/:id', deleteYearlyService)

module.exports = router
