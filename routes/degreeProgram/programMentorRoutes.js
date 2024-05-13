
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const {  getAllProgramMentor, getProgramMentorById, deleteProgramMentor, updateProgramMentor } = require('../../controllers/degreeProgram/ProgramMentor.js');

router.post('/create/program_mentor',createProgramMentor);

router.get('/getAll/program_mentor', getAllProgramMentor);

router.get('/getById/program_mentor/:id', getProgramMentorById);

router.delete('/delete/program_mentor/:id', deleteProgramMentor);

router.put('/update/program_mentor/:id', updateProgramMentor);

module.exports = router;
