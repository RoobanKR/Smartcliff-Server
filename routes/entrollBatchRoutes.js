
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createEntrollBatch,batchResendOTP,getAllEntrollBatch,getEntrollBatchById,deleteEntrollBatchById, batchVerifyOTP } = require('../controllers/entrollbatch.js');

router.post('/create/entrollBatch',createEntrollBatch);
router.post('/otp/batchverify', batchVerifyOTP);
router.post('/otp/batchresend', batchResendOTP);

router.get("/getAll/entrollBatch", getAllEntrollBatch);
router.get("/getById/entrollBatch/:id", getEntrollBatchById);
router.delete("/delete/entrollBatch/:id", deleteEntrollBatchById);

module.exports = router;
