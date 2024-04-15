
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createAssesment, getAllAssessments, getAssessmentById, updateAssessment, deleteAssessment } = require('../../controllers/degreeProgram/assesment.js');

router.post('/create/assesment',createAssesment);

router.get('/getAll/assesment', getAllAssessments);

router.get('/getById/assesment/:assessmentId', getAssessmentById);

router.delete('/delete/assesment/:assessmentId', deleteAssessment);

router.put('/update/assesment/:assesmentId', updateAssessment);

module.exports = router;
