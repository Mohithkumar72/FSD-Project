import React, { useState } from 'react';
import { X, AlertOctagon } from 'lucide-react';

export default function ReportDamageModal({ equipment, users, onClose, onSuccess }) {
  const [reportedBy, setReportedBy] = useState(users[0]?.id || 1);
  const [severity, setSeverity] = useState('Medium');
  const [issueDescription, setIssueDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!equipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issueDescription.trim() || issueDescription.trim().length < 5) {
      setError('Please provide a detailed description (min 5 characters).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSuccess({
        equipment_id: equipment.id,
        reported_by_user_id: Number(reportedBy),
        issue_description: issueDescription,
        severity
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit report');
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
              <AlertOctagon size={22} color="#ef4444" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Report Damage / Equipment Fault
              </h2>
            </div>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#991b1b' }}>
                Affected Equipment:
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7f1d1d' }}>
                {equipment.name} ({equipment.asset_tag})
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Reported By *</label>
              <select
                className="form-control"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role} - {u.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Severity Level *</label>
              <select
                className="form-control"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="Low">Low - Minor cosmetic / non-blocking glitch</option>
                <option value="Medium">Medium - Feature degraded / requires calibration</option>
                <option value="High">High - Unit unfunctional / disrupts lab session</option>
                <option value="Critical">Critical - Safety risk / smoke / electrical failure</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Issue Description & Symptoms *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Describe what occurred, any error codes, unusual sounds, physical damage, or lab conditions..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-danger">
              {loading ? 'Submitting...' : 'Submit Damage Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
