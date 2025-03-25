
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createCertification, getAllCertifications, getCertificationById, deleteCertification, updateCertification } = require('../../controllers/degreeProgram/certification.js');

router.post('/create/degreeprogram/certification',createCertification);

router.get('/getAll/degreeprogram/certification', getAllCertifications);

router.get('/getById/degreeprogram/certification/:id', getCertificationById);

router.delete('/delete/degreeprogram/certification/:id', deleteCertification);

router.put('/update/degreeprogram/certification/:id', updateCertification);

module.exports = router;
