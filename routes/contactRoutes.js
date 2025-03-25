
const express = require('express');
const router = express.Router();
const { submitContact, getAllContact, getContactById, deleteContact } = require('../controllers/contact.js');

router.post('/create/contact',submitContact);

router.get('/getAll/contact', getAllContact);

router.get('/getById/contact/:id', getContactById);

router.delete('/delete/contact/:id', deleteContact);


module.exports = router;
