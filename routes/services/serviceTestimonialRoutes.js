
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createTestimonial, getAllTestimonial, getTestimonialById, updateTestimonial, deleteTestimonial } = require('../../controllers/services/serviceTestimonial.js');

router.post('/create/service_testimonial', createTestimonial);

router.get('/getAll/service_testimonial', getAllTestimonial);

router.get('/getById/service_testimonial/:id', getTestimonialById);

router.delete('/delete/service_testimonial/:id',  deleteTestimonial);

router.put('/update/service_testimonial/:id',updateTestimonial);

module.exports = router;
