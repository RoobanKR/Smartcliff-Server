
const express = require('express');
const router = express.Router();
// const { userRole } = require('../middlewares/userRole.js');
const { userAuth } = require('../../middlewares/userAuth.js');
const { createServiceProcess, getAllServiceProcess, getServiceProcessById, deleteprocessServices, updateProcessService } = require('../../controllers/services/process.js');

router.post('/create/service-process',userAuth,createServiceProcess);

router.get('/getAll/service-process', getAllServiceProcess);
// // 
router.get('/getById/service-process/:id', getServiceProcessById);

router.delete('/delete/service-process/:id', deleteprocessServices);

router.put('/update/service-process/:id', updateProcessService);

module.exports = router;
