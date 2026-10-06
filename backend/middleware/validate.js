// Validation Middleware
const validateEquipment = (req, res, next) => {
  const { asset_tag, name, category_id, laboratory_id } = req.body;
  const errors = [];

  if (!asset_tag || typeof asset_tag !== 'string' || !asset_tag.trim()) {
    errors.push('Asset tag is required and must be a valid identifier');
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Equipment name is required');
  }
  if (!category_id || isNaN(category_id)) {
    errors.push('Valid Category ID is required');
  }
  if (!laboratory_id || isNaN(laboratory_id)) {
    errors.push('Valid Laboratory ID is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

const validateDamageReport = (req, res, next) => {
  const { equipment_id, reported_by_user_id, issue_description } = req.body;
  const errors = [];

  if (!equipment_id || isNaN(equipment_id)) {
    errors.push('Equipment ID is required');
  }
  if (!reported_by_user_id || isNaN(reported_by_user_id)) {
    errors.push('Valid Reporter User ID is required');
  }
  if (!issue_description || typeof issue_description !== 'string' || issue_description.trim().length < 5) {
    errors.push('Issue description must be at least 5 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

const validateAllocation = (req, res, next) => {
  const { equipment_id, allocated_to_user_id, allocated_by_user_id, expected_return_date, purpose } = req.body;
  const errors = [];

  if (!equipment_id || isNaN(equipment_id)) errors.push('Equipment ID is required');
  if (!allocated_to_user_id || isNaN(allocated_to_user_id)) errors.push('Borrower User ID is required');
  if (!allocated_by_user_id || isNaN(allocated_by_user_id)) errors.push('Issuer User ID is required');
  if (!expected_return_date) errors.push('Expected return date is required');
  if (!purpose || !purpose.trim()) errors.push('Allocation purpose is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

module.exports = {
  validateEquipment,
  validateDamageReport,
  validateAllocation
};
