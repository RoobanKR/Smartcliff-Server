
const express = require('express');
const router = express.Router();
// const { userRole } = require('../middlewares/userRole.js');
const { userAuth } = require('../../middlewares/userAuth.js');
const { createServiceClient, getAllServiceClient, getServiceClientById, deleteclientServices, updateClientService } = require('../../controllers/bussiness/client.js'); 

router.post('/create/business/client',createServiceClient);

router.get('/getAll/business/client', getAllServiceClient);
// // 
router.get('/getById/business/client/:id', getServiceClientById);

router.delete('/delete/business/client/:id', deleteclientServices);

router.put('/update/business/client/:id', updateClientService);

module.exports = router;
