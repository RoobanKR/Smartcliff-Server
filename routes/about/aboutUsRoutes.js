const express = require('express')
const router = express.Router()

const { userAuth } = require('../../middlewares/userAuth.js')
const { userRole } = require('../../middlewares/userRole.js')
const { createAboutUs, getAllAboutUs, getAboutUsById, editAboutusById, deleteAboutUsById } = require('../../controllers/about/aboutUs.js')

router.post('/create/about/aboutus',userAuth,createAboutUs)
router.get('/getAll/about/aboutus', getAllAboutUs)
router.get('/getById/about/aboutus/:id',  getAboutUsById)
router.put('/update/about/aboutus/:id',userAuth,editAboutusById)
router.delete('/delete/about/aboutus/:id', deleteAboutUsById)

module.exports = router
