
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createToolSoftware, getAllToolSoftware, getToolSoftwareById, updateToolSoftware, deleteToolSoftware } = require('../controllers/tool_Software.js');

router.post('/create/toolSoftware',createToolSoftware);

router.get('/getAll/toolSoftware', getAllToolSoftware);

router.get('/getById/toolSoftware/:id', getToolSoftwareById);

router.delete('/delete/toolSoftware/:id',deleteToolSoftware);

router.put('/update/toolSoftware/:id',updateToolSoftware);

module.exports = router;
