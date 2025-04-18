const express = require('express');
const { createCareerForm, getAllCareersForm, getCareerFormById, deleteCareerForm, updateCareerForm, sendEmailToApplicants } = require('../controllers/careerForm');
const router = express.Router();

router.post('/create/career-form',createCareerForm);

router.get('/getAll/career-form', getAllCareersForm);

router.get('/getById/career-form/:id', getCareerFormById);

router.delete('/delete/career-form/:id',deleteCareerForm);

router.put('/update/career-form/:id', updateCareerForm);

router.post('/response-mail-send/applicants',sendEmailToApplicants);

module.exports = router;    
