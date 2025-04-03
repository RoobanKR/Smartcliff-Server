const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createHomeExecutionHighlights, getAllHomeExecutionHighlights, updateHomeExecutionHighlights, getHomeExecutionHighlightsById, deleteHomeExecutionHighlights } = require('../../controllers/home/homeExecutionHighlights.js');

router.post('/create/home/execution-highlights',createHomeExecutionHighlights);

router.get('/getAll/home/execution-highlights', getAllHomeExecutionHighlights);

router.get('/getById/home/execution-highlights/:id', getHomeExecutionHighlightsById);

router.delete('/delete/home/execution-highlights/:id',deleteHomeExecutionHighlights);

router.put('/update/home/execution-highlights/:id', updateHomeExecutionHighlights);

module.exports = router;    
