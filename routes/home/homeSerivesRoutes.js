const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createHomeSerives, getAllHomeServices, getHomeServiceById, deleteHomeService, updateHomeService } = require('../../controllers/home/homeService.js');

router.post('/create/home/services',createHomeSerives);

router.get('/getAll/home/services', getAllHomeServices);

router.get('/getById/home/services/:id', getHomeServiceById);

router.delete('/delete/home/services/:id',deleteHomeService);

router.put('/update/home/services/:id', updateHomeService);

module.exports = router;    
