
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createCourseApplyNow, verifyOTP, getAllCourseApplications, getCourseApplicationById, deleteCourseApplicationById, resendOTP } = require('../controllers/CourseApplyNow.js');

router.post('/create/courseapplynow',createCourseApplyNow);
router.post('/otp/verify', verifyOTP);
router.post('/otp/resend', resendOTP);

router.get("/getAll/courseapplynow",userAuth,userRole(['admin', 'super_admin']), getAllCourseApplications);
router.get("/getById/courseapplynow/:id",userAuth,userRole(['admin', 'super_admin']), getCourseApplicationById);
router.delete("/delete/courseapplynow/:id", deleteCourseApplicationById);

module.exports = router;
