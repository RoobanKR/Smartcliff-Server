
const express = require('express');
const router = express.Router();
// const { userRole } = require('../middlewares/userRole.js');
const { createServiceAbout, getAllServiceAbout, getAboutServiceById,  deleteAboutServices, updateAboutService } = require('../../controllers/services/about.js');
const { userAuth } = require('../../middlewares/userAuth.js');

router.post('/create/service-about',userAuth,createServiceAbout);

router.get('/getAll/service-about', getAllServiceAbout);
// 
router.get('/getById/service-about/:id', getAboutServiceById);

router.delete('/delete/service-about/:id', deleteAboutServices);

router.put('/update/service-about/:id', updateAboutService);

module.exports = router;
