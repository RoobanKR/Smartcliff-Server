
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createExecutionOverview, getAllExecutionOverviews, getExecutionOverviewById, deleteExecutionOverview, updateExecutionOverview } = require('../../controllers/services/executionOverview.js');

router.post('/create/execution_overview', createExecutionOverview);

router.get('/getAll/execution_overview', getAllExecutionOverviews);

router.get('/getById/execution_overview/:id', getExecutionOverviewById);

router.delete('/delete/execution_overview/:id',  deleteExecutionOverview);

router.put('/update/execution_overview/:id',updateExecutionOverview);

module.exports = router;
