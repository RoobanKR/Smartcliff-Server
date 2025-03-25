
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createOurSponsors, getAllOurSponsors, getOurSponsorsById, deleteOurSponsors, updateOurSponsors } = require('../../controllers/degreeProgram/ourSponsors.js');

router.post('/create/our-sponsors',createOurSponsors);

router.get('/getAll/our-sponsors', getAllOurSponsors);

router.get('/getById/our-sponsors/:id', getOurSponsorsById);

router.delete('/delete/our-sponsors/:id', deleteOurSponsors);

router.put('/update/our-sponsors/:id', updateOurSponsors);

module.exports = router;
