
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createSemester, getAllSemesters, getSemesterById, deleteSemester, updateSemester } = require('../../controllers/degreeProgram/semester.js');

router.post('/create/semester',createSemester);

router.get('/getAll/semester', getAllSemesters);

router.get('/getById/semester/:id', getSemesterById);

router.delete('/delete/semester/:id', deleteSemester);

router.put('/update/semester/:id', updateSemester);

module.exports = router;
