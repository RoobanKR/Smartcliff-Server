const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createLearningJourney, getAllLearningJourney, getLearningJourneyById, deleteLearningJourneyById, updateLearningJourneyById } = require('../../controllers/bussiness/learningJourney.js');

router.post('/create/business/learning-journey',createLearningJourney);

router.get('/getAll/business/learning-journey', getAllLearningJourney);

router.get('/getById/business/learning-journey/:id', getLearningJourneyById);

router.delete('/delete/business/learning-journey/:id',deleteLearningJourneyById);

router.put('/update/business/learning-journey/:id', updateLearningJourneyById);

module.exports = router;    
