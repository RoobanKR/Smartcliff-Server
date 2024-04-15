
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createFaq, getAllFaq, getFaqById, updateFaq, deleteFaq } = require('../controllers/faq.js');

router.post('/create/faq',createFaq);

router.get('/getAll/faq', getAllFaq);

router.get('/faq/getById/:id', getFaqById);

router.delete('/faq/delete/:id',userAuth,userRole(['admin', 'super_admin']), deleteFaq);

router.put('/faq/edit/:id',userAuth,userRole(['admin', 'super_admin']), updateFaq);

module.exports = router;
