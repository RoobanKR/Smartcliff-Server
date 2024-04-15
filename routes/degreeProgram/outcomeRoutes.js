
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createOutcome, getAllOutcome, getOutcomeById, deleteOutcome, updateOutcome } = require('../../controllers/degreeProgram/outcome.js');

router.post('/create/outcome',createOutcome);

router.get('/getAll/outcome', getAllOutcome);

router.get('/getById/outcome/:id', getOutcomeById);

router.delete('/delete/outcome/:id', deleteOutcome);

router.put('/update/outcome/:id', updateOutcome);

module.exports = router;
