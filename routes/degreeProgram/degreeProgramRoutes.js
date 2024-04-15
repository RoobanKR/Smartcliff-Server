
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createDegreeProgram, getAllDegreeProgram, getDegreeProgramById, updateDegreeProgram, deleteDegreeProgram } = require('../../controllers/degreeProgram/degreeProgram.js');

router.post('/create/degree_Program',createDegreeProgram);

router.get('/getAll/degree_Program', getAllDegreeProgram);

router.get('/getById/degree_Program/:id', getDegreeProgramById);

router.delete('/delete/degree_Program/:degreeProgramId', deleteDegreeProgram);

router.put('/update/degree_Program/:degreeProgramId', updateDegreeProgram);

module.exports = router;
