
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createOurPartners, getAllOurPartners, getOurPartnersById, deleteOurPartners, updateOurPartners } = require('../../controllers/degreeProgram/ourPartners.js');

router.post('/create/our-partners',createOurPartners);

router.get('/getAll/our-partners', getAllOurPartners);

router.get('/getById/our-partners/:id', getOurPartnersById);

router.delete('/delete/our-partners/:id', deleteOurPartners);

router.put('/update/our-partners/:id', updateOurPartners);

module.exports = router;
