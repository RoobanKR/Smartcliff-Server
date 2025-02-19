
const express = require('express');
const router = express.Router();
// const { userRole } = require('../middlewares/userRole.js');
const { userAuth } = require('../../middlewares/userAuth.js');
const { createServiceClient, getAllServiceClient, getServiceClientById, deleteclientServices, updateClientService } = require('../../controllers/services/client.js');

router.post('/create/service-clients',createServiceClient);

router.get('/getAll/service-clients', getAllServiceClient);
// // 
router.get('/getById/service-client/:id', getServiceClientById);

router.delete('/delete/service-client/:id', deleteclientServices);

router.put('/update/service-client/:id', updateClientService);

module.exports = router;
