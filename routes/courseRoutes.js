
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createCourse, getAllCourses, getCourseById, updateCourseById, deleteCourse, updateCourseIsOpen, toggleCourseOpenStatus } = require('../controllers/course.js');

router.post('/create/course',createCourse);

router.get('/getAll/course', getAllCourses);

router.get('/getById/course/:id', getCourseById);

router.delete('/delete/course/:id', deleteCourse);

router.put('/update/course/:id', updateCourseById);

router.put('/update/course/isopen/:id', toggleCourseOpenStatus);

module.exports = router;
