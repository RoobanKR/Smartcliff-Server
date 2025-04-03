const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createHomeSerivesCount, getAllHomeServicesCount, getHomeServiceByIdCount, deleteHomeServiceCount, updateHomeServiceCount } = require('../../controllers/home/homeServiceCount.js');

router.post('/create/home/services-count',createHomeSerivesCount);

router.get('/getAll/home/services-count', getAllHomeServicesCount);

router.get('/getById/home/services-count/:id', getHomeServiceByIdCount);

router.delete('/delete/home/services-count/:id',deleteHomeServiceCount);

router.put('/update/home/services-count/:id', updateHomeServiceCount);

module.exports = router;    
