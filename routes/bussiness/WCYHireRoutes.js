const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createWCYHire, getAllWCYHire, getWCYHireById, deleteWCYHire, updateWCYHire } = require('../../controllers/bussiness/wcyHire.js');

router.post('/create/business/why-can-you',createWCYHire);

router.get('/getAll/business/why-can-you', getAllWCYHire);

router.get('/getById/business/why-can-you/:id', getWCYHireById);

router.delete('/delete/business/why-can-you/:id',deleteWCYHire);

router.put('/update/business/why-can-you/:id', updateWCYHire);

module.exports = router;    
