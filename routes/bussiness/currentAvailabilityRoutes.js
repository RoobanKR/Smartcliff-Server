const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createCurrentAvailability, getAllCurrentAvailabilities, getCurrentAvailabilityById, deleteCurrentAvailability, updateCurrentAvailability } = require('../../controllers/bussiness/currentAvailability.js');

router.post('/create/business/current-availability',createCurrentAvailability);

router.get('/getAll/business/current-availability', getAllCurrentAvailabilities);

router.get('/getById/business/current-availability/:id', getCurrentAvailabilityById);

router.delete('/delete/business/current-availability/:id',deleteCurrentAvailability);

router.put('/update/business/current-availability/:id', updateCurrentAvailability);

module.exports = router;    
