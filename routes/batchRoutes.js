const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createBatches, getAllBatches, getBatchesById, deleteBatches, updateBatches } = require('../controllers/batches.js');

router.post('/create/batches',createBatches);

router.get('/getAll/batches', getAllBatches);

router.get('/getById/batches/:id', getBatchesById);

router.delete('/delete/batches/:id',deleteBatches);

router.put('/update/batches/:id', updateBatches);

module.exports = router;    
