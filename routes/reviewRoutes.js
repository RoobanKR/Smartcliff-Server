const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createReview, getAllReview, getReviewById, deleteReview, updateReview } = require('../controllers/review.js');

router.post('/create/review',createReview);

router.get('/getAll/review', getAllReview);

router.get('/getById/review/:id', getReviewById);

router.delete('/delete/review/:reviewId',deleteReview);

router.put('/update/review/:reviewId', updateReview);

module.exports = router;    
