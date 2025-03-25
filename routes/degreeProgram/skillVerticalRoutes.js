
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createSkillVertical, getAllSkillVerticals, getSkillVerticalById, deleteSkillVertical, updateSkillVertical } = require('../../controllers/degreeProgram/skilVertical.js');

router.post('/create/degreeprogram/skill-vertical',createSkillVertical);

router.get('/getAll/degreeprogram/skill-vertical', getAllSkillVerticals);

router.get('/getById/degreeprogram/skill-vertical/:id', getSkillVerticalById);

router.delete('/delete/degreeprogram/skill-vertical/:id', deleteSkillVertical);

router.put('/update/degreeprogram/skill-vertical/:id', updateSkillVertical);

module.exports = router;
