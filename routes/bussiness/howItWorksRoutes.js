const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createHowItWork, getAllHowItWork, getHowItWorkById, deleteHowItWorkById, updateHowItWorkById } = require('../../controllers/bussiness/howItWorks.js');

router.post('/create/business/how-it-works',createHowItWork);

router.get('/getAll/business/how-it-works', getAllHowItWork);

router.get('/getById/business/how-it-works/:id', getHowItWorkById);

router.delete('/delete/business/how-it-works/:id',deleteHowItWorkById);

router.put('/update/business/how-it-works/:id', updateHowItWorkById);

module.exports = router;    
