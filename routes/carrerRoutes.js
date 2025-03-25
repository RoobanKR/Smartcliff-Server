const express = require('express');
const { createCareer, getAllCareers, getCareerById, deleteCareerById, updateCareer } = require('../controllers/carrer');
const router = express.Router();

router.post('/create/career',createCareer);

router.get('/getAll/career', getAllCareers);

router.get('/getById/career/:id', getCareerById);

router.delete('/delete/career/:id',deleteCareerById);

router.put('/update/career/:id', updateCareer);

module.exports = router;    
