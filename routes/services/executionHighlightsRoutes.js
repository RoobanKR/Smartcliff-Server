
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createExecutionHighlights, getAllExecutionHighlights, getExecutionHighlightsById, updateExecutionHighlights, deleteExecutionHighlights } = require('../../controllers/services/executionHighlights.js');

router.post('/create/execution_highlight', createExecutionHighlights);

router.get('/getAll/execution_highlight', getAllExecutionHighlights);

router.get('/getById/execution_highlight/:id', getExecutionHighlightsById);

router.delete('/delete/execution_highlight/:id',  deleteExecutionHighlights);

router.put('/update/execution_highlight/:id',updateExecutionHighlights);

module.exports = router;
