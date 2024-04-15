const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createBatches, getAllBatches, getBatchesById, deleteBatches, updateBatches } = require('../controllers/batches.js');

router.post('/create/batches',createBatches);

router.get('/getAll/batches', getAllBatches);

router.get('/getById/batches/:id', getBatchesById);

router.delete('/delete/batches/:id', userAuth,userRole(['admin', 'super_admin']),deleteBatches);

router.put('/update/batches/:id',userAuth,userRole(['admin', 'super_admin']), updateBatches);

module.exports = router;
