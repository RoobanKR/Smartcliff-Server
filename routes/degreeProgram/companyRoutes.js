
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createCompany, getAllCompany, getCompanyById, deleteCompany, updateCompany } = require('../../controllers/degreeProgram/company.js');

router.post('/create/degreeprogram/company',createCompany);

router.get('/getAll/degreeprogram/company', getAllCompany);

router.get('/getById/degreeprogram/company/:id', getCompanyById);

router.delete('/delete/degreeprogram/company/:id', deleteCompany);

router.put('/update/degreeprogram/company/:id', updateCompany);

module.exports = router;
