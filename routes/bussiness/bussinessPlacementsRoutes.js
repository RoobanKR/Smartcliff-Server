const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createBussinessPlacements, getBussinessPlacementsById, deleteBussinessPlacements, updateBussinessPlacements, getAllBussinessPlacements } = require('../../controllers/bussiness/bussinessPlacements.js');

router.post('/create/bussiness_placements',createBussinessPlacements);

router.get('/getAll/bussiness_placements', getAllBussinessPlacements);

router.get('/getById/bussiness_placements/:id', getBussinessPlacementsById);

router.delete('/delete/bussiness_placements/:id',deleteBussinessPlacements);

router.put('/update/bussiness_placements/:id', updateBussinessPlacements);

module.exports = router;    
