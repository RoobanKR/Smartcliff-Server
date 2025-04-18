
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createFooter, getAllFooter, getFooterById, updateFooter, deleteFooter } = require('../controllers/footer.js');

router.post('/create/footer',createFooter);

router.get('/getAll/footer', getAllFooter);

router.get('/getById/footer/:id', getFooterById);

router.delete('/delete/footer/:id', deleteFooter);

router.put('/update/footer/:id', updateFooter);

module.exports = router;
