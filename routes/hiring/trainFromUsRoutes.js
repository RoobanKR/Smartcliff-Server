const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createTrainFromUs, getAllTrainFromUs, getTrainFromUsById, deleteTrainFromUs, sendResponseEmailTrainFromUs } = require('../../controllers/hiring/trainFromUs.js');

router.post('/create/train_from_us',createTrainFromUs);

router.get('/getAll/train_from_us', getAllTrainFromUs);

router.get('/getById/train_from_us/:id', getTrainFromUsById);

router.delete('/delete/train_from_us/:id',deleteTrainFromUs);

router.post('/train-from-us/response-mail/applicants',sendResponseEmailTrainFromUs);

module.exports = router;    
