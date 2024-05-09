const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createInstituteForm } = require('../../controllers/hiring/instituteForm.js');

router.post('/create/institute',createInstituteForm);

// router.get('/getAll/hire_from_us', getAllHireFromUs);

// router.get('/getById/hire_from_us/:id', getHireFromUsById);

// router.delete('/delete/hire_from_us/:id',deleteHireFromUs);

module.exports = router;    
