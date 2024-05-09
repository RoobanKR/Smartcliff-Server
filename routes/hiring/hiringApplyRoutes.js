const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createHiringApply } = require('../../controllers/hiring/hiringApply.js');

router.post('/create/hiring_Apply',createHiringApply);

// router.get('/getAll/hiring', getAllHiring);

// router.get('/getById/hiring/:id', getHiringById);

// router.delete('/delete/hiring/:id',deleteHiring);

// router.put('/update/hiring/:id', updateHiringById);

module.exports = router;    
