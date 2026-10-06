import React, { useState } from 'react';
import { X, Share2 } from 'lucide-react';

export default function AllocationModal({ equipment, users, onClose, onSuccess }) {
  const [borrowerId, setBorrowerId] = useState(users.find(u => u.role === 'Student')?.id || users[0]?.id || 1);
  const [issuerId, setIssuerId] = useState(users.find(u => u.role === 'Lab Assistant' || u.role === 'Faculty')?.id || users[0]?.id || 1);
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!equipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) {
      setError('Please specify the allocation purpose / project.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSuccess({
        equipment_id: equipment.id,
        allocated_to_user_id: Number(borrowerId),
        allocated_by_user_id: Number(issuerId),
        expected_return_date: expectedReturnDate,
        purpose
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to allocate equipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={22} color="#2563eb" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Allocate Equipment
              </h2>
            </div>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e40af' }}>
                Equipment to Allocate:
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>
                {equipment.name} ({equipment.asset_tag})
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Allocate To (Borrower) *</label>
              <select
                className="form-control"
                value={borrowerId}
                onChange={(e) => setBorrowerId(e.target.value)}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role} - {u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Issued By (Faculty / Lab Assistant) *</label>
              <select
                className="form-control"
                value={issuerId}
                onChange={(e) => setIssuerId(e.target.value)}
              >
                {users.filter(u => u.role !== 'Student').map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Return Date *</label>
              <input
                type="date"
                className="form-control"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Purpose / Project Details *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Embedded systems lab assignment, thesis machine learning training..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
