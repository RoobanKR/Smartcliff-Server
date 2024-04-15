
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createEligibilityCriteria, getAllEligibilityCriteria, getEligibilityCriteriaById, updateEligibilityCriteria, deleteEligibilityCriteria } = require('../../controllers/degreeProgram/eligibilityCriteria.js');

router.post('/create/eligibility',createEligibilityCriteria);

router.get('/getAll/eligibility', getAllEligibilityCriteria);

router.get('/getById/eligibility/:id', getEligibilityCriteriaById);

router.delete('/delete/eligibility/:id', deleteEligibilityCriteria);

router.put('/update/eligibility/:id', updateEligibilityCriteria);

module.exports = router;
