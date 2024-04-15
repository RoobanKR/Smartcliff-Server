const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const {  createCareerOppertunities, getAllCareerOpportunities, getCareerOpportunityById, updateCareerOpportunity, deleteCareerOpportunity } = require('../controllers/careerOppertunities.js');

router.post('/create/careeroppertunities',userAuth,userRole(['admin', 'super_admin']),createCareerOppertunities);

router.get('/getAll/careeroppertunities', getAllCareerOpportunities);

router.get('/getById/careeroppertunities/:id', getCareerOpportunityById);

router.delete('/delete/careeroppertunities/:id',userAuth,userRole(['admin', 'super_admin']), deleteCareerOpportunity);

router.put('/update/careeroppertunities/:id',userAuth,userRole(['admin', 'super_admin']), updateCareerOpportunity);

module.exports = router;
