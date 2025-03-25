
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createCollege, getAllColleges, getCollegeById, deleteCollege, updateCollege } = require('../../controllers/degreeProgram/college.js');

router.post('/create/degreeprogram/college',createCollege);

router.get('/getAll/degreeprogram/college', getAllColleges);

router.get('/getById/degreeprogram/college/:id', getCollegeById);

router.delete('/delete/degreeprogram/college/:id', deleteCollege);

router.put('/update/degreeprogram/college/:id', updateCollege);

module.exports = router;
