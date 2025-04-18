const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createInstituteForm, getAllInstituteFormApplications, getInstituteFormById, sendResponseEmailInstituteForm, deleteInstitute } = require('../../controllers/hiring/instituteForm.js');

router.post('/create/institute',createInstituteForm);

router.get('/getAll/institute', getAllInstituteFormApplications);

router.get('/getById/institute/:id', getInstituteFormById);

router.delete('/delete/institute/:id',deleteInstitute);

router.post('/institute/response-mail/applicants',sendResponseEmailInstituteForm);

module.exports = router;    
