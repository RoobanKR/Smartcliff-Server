const express = require('express');
const { createAddress, getAllAddress, getAddressById, deleteAddress, updateAddress } = require('../controllers/address');
const router = express.Router();

router.post('/create/address',createAddress);

router.get('/getAll/address', getAllAddress);

router.get('/getById/address/:id', getAddressById);

router.delete('/delete/address/:id',deleteAddress);

router.put('/update/address/:id', updateAddress);

module.exports = router;    
