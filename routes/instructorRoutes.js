
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createInstructor, getAllInstructor, getInstructorById, deleteInstructor, updateInstructor } = require('../controllers/instructor.js');

router.post('/create/instructor',createInstructor);

router.get('/getAll/instructor', getAllInstructor);

router.get('/getById/instructor/:id', getInstructorById);

router.delete('/delete/instructor/:id', deleteInstructor);

router.put('/update/instructor/:id', updateInstructor);

module.exports = router;
