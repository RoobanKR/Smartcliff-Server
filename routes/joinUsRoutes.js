const express = require("express");
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createJobPosition, getAllJobPositions, getJobPositionById, updateJobPosition, deleteJobPosition, updateSelectedJobPosition } = require("../controllers/joinUs.js");


router.post("/create/joinus", createJobPosition);
router.get("/getAll/joinus", getAllJobPositions);
router.get("/getById/joinus/:id", getJobPositionById);
router.put("/update/joinus/:id", updateJobPosition);
router.delete("/delete/joinus/:id", deleteJobPosition);
router.put("/change/selected/:id", updateSelectedJobPosition);

module.exports = router;
