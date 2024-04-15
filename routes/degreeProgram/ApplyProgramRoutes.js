const express = require("express");
const router = express.Router();
const { userAuth } = require("../../middlewares/userAuth.js");
const { userRole } = require("../../middlewares/userRole.js");
const {
  createProgramApply,
  verifyOTP,
  resendOTP,
  sendMailById,
  sendProgramApplyEmail,
  login,
  getAllProgramApplications,
  updateProgramApplication,
} = require("../../controllers/degreeProgram/ProgramApply.js"); 

router.post("/create/programapply", createProgramApply);
router.post("/programotp/verify", verifyOTP);
router.post("/programotp/resend", resendOTP);
router.get("/getAll/programapply", getAllProgramApplications);
router.post('/replaytheuser/:id', sendProgramApplyEmail);
router.post('/lms/login', login);

router.put('/edit/programapply/:id', updateProgramApplication);

module.exports = router;
