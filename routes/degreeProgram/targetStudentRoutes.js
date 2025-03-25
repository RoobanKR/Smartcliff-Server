
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createTargetStudent, getAllTargetStudent, getTargetStudentById, deleteTargetStudent, updateTargetStudent } = require('../../controllers/degreeProgram/targetStudent.js');

router.post('/create/degreeprogram/target-student',createTargetStudent);

router.get('/getAll/degreeprogram/target-student', getAllTargetStudent);

router.get('/getById/degreeprogram/target-student/:id', getTargetStudentById);

router.delete('/delete/degreeprogram/target-student/:id', deleteTargetStudent);

router.put('/update/degreeprogram/target-student/:id', updateTargetStudent);

module.exports = router;
