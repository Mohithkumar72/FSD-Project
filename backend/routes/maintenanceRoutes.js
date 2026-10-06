const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { validateDamageReport } = require('../middleware/validate');

router.get('/', maintenanceController.getAllMaintenance);
router.post('/report', validateDamageReport, maintenanceController.reportDamage);
router.patch('/:id/status', maintenanceController.updateMaintenanceStatus);

module.exports = router;
