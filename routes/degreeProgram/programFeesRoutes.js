
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createProgramFees, getAllProgramFees, deleteProgramFees, updateProgramFees, getProgramFeesById } = require('../../controllers/degreeProgram/programFees.js');

router.post('/create/program_fees',createProgramFees);

router.get('/getAll/program_fees', getAllProgramFees);

router.get('/getById/program_fees/:id', getProgramFeesById);

router.delete('/delete/program_fees/:id', deleteProgramFees);

router.put('/update/program_fees/:id', updateProgramFees);

module.exports = router;
