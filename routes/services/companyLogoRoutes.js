
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createCompanyLogo, getAllCompanyLogo, getCompanyLogoById, updateCompanyLogo, deleteCompanyLogo } = require('../../controllers/services/companyLogo.js');

router.post('/create/client', createCompanyLogo);

router.get('/getAll/client', getAllCompanyLogo);

router.get('/getById/client/:id', getCompanyLogoById);

router.delete('/delete/client/:id',  deleteCompanyLogo);

router.put('/update/client/:id',updateCompanyLogo);

module.exports = router;
