import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function EquipmentFormModal({ onClose, onSuccess, categories, laboratories }) {
  const [formData, setFormData] = useState({
    asset_tag: '',
    name: '',
    category_id: categories[0]?.id || 1,
    laboratory_id: laboratories[0]?.id || 1,
    model_number: '',
    serial_number: '',
    status: 'Available',
    purchase_date: new Date().toISOString().split('T')[0],
    warranty_expiry: '',
    specifications: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asset_tag.trim() || !formData.name.trim()) {
      setError('Please provide Asset Tag and Equipment Name.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSuccess(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register equipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Add Laboratory Equipment
            </h2>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Asset Tag / Inventory Code *</label>
                <input
                  type="text"
                  name="asset_tag"
                  className="form-control"
                  placeholder="e.g. EQ-CS-105"
                  value={formData.asset_tag}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Equipment Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. HP Z4 G4 Workstation"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category_id"
                  className="form-control"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Laboratory *</label>
                <select
                  name="laboratory_id"
                  className="form-control"
                  value={formData.laboratory_id}
                  onChange={handleChange}
                >
                  {laboratories.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Model Number</label>
                <input
                  type="text"
                  name="model_number"
                  className="form-control"
                  placeholder="e.g. Z4-G4-XEON"
                  value={formData.model_number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Serial Number</label>
                <input
                  type="text"
                  name="serial_number"
                  className="form-control"
                  placeholder="e.g. SN-HP-883921"
                  value={formData.serial_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Allocated">Allocated</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  className="form-control"
                  value={formData.purchase_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Warranty Expiry</label>
              <input
                type="date"
                name="warranty_expiry"
                className="form-control"
                value={formData.warranty_expiry}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Technical Specifications / Description</label>
              <textarea
                name="specifications"
                className="form-control"
                rows="3"
                placeholder="Hardware specs, software version, accessories included..."
                value={formData.specifications}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
