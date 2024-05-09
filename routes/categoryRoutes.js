
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category.js');

router.post('/create/category',createCategory);

router.get('/getAll/category', getAllCategory);

router.get('/getById/category/:id', getCategoryById);

router.delete('/delete/category/:categoryId',userAuth,userRole(['admin', 'super_admin']), deleteCategory);

router.put('/update/category/:categoryId',userAuth,userRole(['admin', 'super_admin']), updateCategory);

module.exports = router;
