
const express = require('express');
const router = express.Router();
const { submitEnquiry, getAllEnquiries, getEnquiryById, deleteEnquiry, sendResponseEmailEnquiry } = require('../controllers/enquiry.js');

router.post('/create/enquiry',submitEnquiry);

router.get('/getAll/enquiry', getAllEnquiries);

router.get('/getById/enquiry/:id', getEnquiryById);

router.delete('/delete/enquiry/:id', deleteEnquiry);

router.post('/enquiry/response-mail/applicants',sendResponseEmailEnquiry);

module.exports = router;
