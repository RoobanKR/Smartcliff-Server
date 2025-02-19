
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createbusinessService, getAllbusinessService, getbusinessServiceById, deletebusinessServices, updatebusinessSerives } = require('../../controllers/services/businessService.js');

router.post('/create/business-services',userAuth, createbusinessService);

router.get('/getAll/business-services', getAllbusinessService);

router.get('/getById/business-services/:id', getbusinessServiceById);

router.delete('/delete/business-service/:id',  deletebusinessServices);

router.put('/update/business-service/:id',updatebusinessSerives);

module.exports = router;
