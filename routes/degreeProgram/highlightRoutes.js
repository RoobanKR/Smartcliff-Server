
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createHighlight, getAllHighlights, getHighlightById, updateHighlight, deleteHighlight } = require('../../controllers/degreeProgram/highlight.js');

router.post('/create/highlight',createHighlight);

router.get('/getAll/highlight', getAllHighlights);

router.get('/getById/highlight/:id', getHighlightById);

router.delete('/delete/highlight/:id', deleteHighlight);

router.put('/update/highlight/:highlightId', updateHighlight);

module.exports = router;
