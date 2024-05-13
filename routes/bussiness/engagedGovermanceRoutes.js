const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createEngagedGovermence, getAllEngagedGovermence, getEngagedGovermenceById, deleteEngagedGovermence, updateEngagedGovermence } = require('../../controllers/bussiness/engagedGovermance.js');

router.post('/create/engaged_govermence',createEngagedGovermence);

router.get('/getAll/engaged_govermence', getAllEngagedGovermence);

router.get('/getById/engaged_govermence/:id', getEngagedGovermenceById);

router.delete('/delete/engaged_govermence/:id',deleteEngagedGovermence);

router.put('/update/engaged_govermence/:id', updateEngagedGovermence);

module.exports = router;    
