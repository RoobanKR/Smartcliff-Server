const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createKeyElements, getAllKeyElements, getKeyElementsById, deleteKeyElements, updateKeyElements } = require('../../controllers/bussiness/keyElements.js');

router.post('/create/key_elements',createKeyElements);

router.get('/getAll/key_elements', getAllKeyElements);

router.get('/getById/key_elements/:id', getKeyElementsById);

router.delete('/delete/key_elements/:id',deleteKeyElements);

router.put('/update/key_elements/:id', updateKeyElements);

module.exports = router;    
