const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createHireFromUs, getAllHireFromUs, getHireFromUsById, deleteHireFromUs, sendResponseEmailhireFromUs } = require('../../controllers/hiring/hireFromUs.js');

router.post('/create/hire_from_us',createHireFromUs);

router.post('/response_mail/hire_from_us',sendResponseEmailhireFromUs);


router.get('/getAll/hire_from_us', getAllHireFromUs);

router.get('/getById/hire_from_us/:id', getHireFromUsById);

router.delete('/delete/hire_from_us/:id',deleteHireFromUs);

module.exports = router;    
