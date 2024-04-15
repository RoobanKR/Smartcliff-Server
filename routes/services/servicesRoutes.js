
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createServices, getAllService, getServiceById, updateService, deleteServices } = require('../../controllers/services/services.js');

router.post('/create/service', createServices);

router.get('/getAll/service', getAllService);

router.get('/getById/service/:id', getServiceById);

router.delete('/delete/service/:id', deleteServices);

router.put('/update/service/:id',updateService);

module.exports = router;
