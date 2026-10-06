const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');
const { validateAllocation } = require('../middleware/validate');

router.get('/', allocationController.getAllAllocations);
router.post('/', validateAllocation, allocationController.createAllocation);
router.patch('/:id/return', allocationController.returnAllocation);

module.exports = router;
