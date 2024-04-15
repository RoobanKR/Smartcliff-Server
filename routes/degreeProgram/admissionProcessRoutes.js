
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createAdmission, getAllAdmission, getAdmissionById, deleteAdmission, updateAdmission } = require('../../controllers/degreeProgram/admissionProcess.js');

router.post('/create/admission',createAdmission);

router.get('/getAll/admission', getAllAdmission);

router.get('/getById/admission/:id', getAdmissionById);

router.delete('/delete/admission/:id', deleteAdmission);

router.put('/update/admission/:id', updateAdmission);

module.exports = router;
