
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createOurProgram, getAllOurProgram, getOurProgramById, updateOurProgram, deleteOurProgram } = require('../../controllers/degreeProgram/ourProgram.js');

router.post('/create/our_program',createOurProgram);

router.get('/getAll/our_program', getAllOurProgram);

router.get('/getById/our_program/:id', getOurProgramById);

router.delete('/delete/our_program/:id', deleteOurProgram);

router.put('/update/our_program/:id', updateOurProgram);

module.exports = router;
