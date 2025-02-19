
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createServiceOpportunities, getAllServiceOpportunity, getServiceOpportunityById, deleteServiceOpportunity, updateServiceOpportunity } = require('../../controllers/services/serviceOppertunities.js');

router.post('/create/service/opportunities',createServiceOpportunities);

router.get('/getAll/service/opportunities', getAllServiceOpportunity);

router.get('/getById/service/opportunities/:id', getServiceOpportunityById);

router.delete('/delete/service/opportunities/:id',  deleteServiceOpportunity);

router.put('/update/service/opportunities/:id',updateServiceOpportunity);

module.exports = router;
