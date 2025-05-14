
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { createDPBeneficiaries, getAllDPBeneficiaries, getDPBeneficiariesById, deleteDPBeneficiaries, updateDPBeneficiaries } = require('../../controllers/degreeProgram/dbBeneficiaries.js');

router.post('/create/dp-beneficiaries',createDPBeneficiaries);

router.get('/getAll/dp-beneficiaries', getAllDPBeneficiaries);
// 
router.get('/getById/dp-beneficiaries/:id', getDPBeneficiariesById);

router.delete('/delete/dp-beneficiaries/:id', deleteDPBeneficiaries);

router.put('/update/dp-beneficiaries/:id', updateDPBeneficiaries);

module.exports = router;
