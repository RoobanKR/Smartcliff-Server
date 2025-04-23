const express = require('express');
const { createContactPage, getAllContactPages, getContactPageById, deleteContactPage, updateContactPage } = require('../controllers/contactPage');
const router = express.Router();

router.post('/create/contact-page',createContactPage);

router.get('/getAll/contact-page', getAllContactPages);

router.get('/getById/contact-page/:id', getContactPageById);

router.delete('/delete/contact-page/:id',deleteContactPage);

router.put('/update/contact-page/:id', updateContactPage);

module.exports = router;    
