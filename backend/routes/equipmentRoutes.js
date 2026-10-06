const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { validateEquipment } = require('../middleware/validate');

router.get('/', equipmentController.getAllEquipment);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', validateEquipment, equipmentController.createEquipment);
router.put('/:id', validateEquipment, equipmentController.updateEquipment);
router.patch('/:id/status', equipmentController.updateEquipmentStatus);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
