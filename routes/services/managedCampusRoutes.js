
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createManagedCampus, getAllManagedCampus, getManagedCampusById, deleteManagedCampus,updateManagedCampus } = require('../../controllers/services/managedCampus.js');

router.post('/create/managed_campus', createManagedCampus);

router.get('/getAll/managed_campus', getAllManagedCampus);

router.get('/getById/managed_campus/:id', getManagedCampusById);

router.delete('/delete/managed_campus/:id',  deleteManagedCampus);

router.put('/update/managed_campus/:id',updateManagedCampus);

module.exports = router;
