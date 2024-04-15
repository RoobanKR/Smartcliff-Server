const express = require('express')
const router = express.Router()
const {
  createWCU,
  deleteWCUById,
  getAllWCU,
  getWCUById,
  editWCUById,
} = require('../controllers/wcu.js')
const { userAuth } = require('../middlewares/userAuth.js')
const { userRole } = require('../middlewares/userRole.js')

router.post('/wcu/create', userAuth, userRole(['admin', 'super_admin']), createWCU)
router.get('/wcu/getAll', getAllWCU)
router.get('/wcu/get/:id', userAuth, getWCUById)
router.put('/wcu/edit/:id', userAuth, userRole(['admin', 'super_admin']), editWCUById)
router.delete('/wcu/delete/:id', userAuth, userRole(['admin', 'super_admin']), deleteWCUById)

module.exports = router
