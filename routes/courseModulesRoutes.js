
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createCourseModules, getAllCourseModules, getCourseModuleById, updateCourseModule, deleteCourseModule } = require('../controllers/courseModules.js');

router.post('/create/coursemodules', createCourseModules);

router.get('/getAll/coursemodules', getAllCourseModules);

router.get('/getById/coursemodules/:id', getCourseModuleById);

router.delete('/delete/coursemodules/:id',  deleteCourseModule);

router.put('/update/coursemodules/:id',updateCourseModule);

module.exports = router;
