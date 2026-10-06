import React, { useState } from 'react';
import { Wrench, CheckCircle, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

export default function MaintenanceTracker({ maintenanceList, onUpdateStatus }) {
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = maintenanceList.filter(item => {
    if (filter === 'all') return true;
    return item.status.toLowerCase() === filter.toLowerCase();
  });

  const handleStatusChange = async (id, nextStatus) => {
    try {
      setUpdatingId(id);
      let notes = '';
      let cost = 0;
      if (nextStatus === 'Resolved') {
        notes = window.prompt('Enter resolution summary/repair notes:', 'Issue rectified, component tested.');
        const costInput = window.prompt('Enter repair cost incurred ($):', '0');
        cost = parseFloat(costInput) || 0;
      }
      await onUpdateStatus(id, nextStatus, notes, cost);
    } finally {
      setUpdatingId(null);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return <span className="badge" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>Critical</span>;
      case 'High':
        return <span className="badge" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>High</span>;
      case 'Medium':
        return <span className="badge" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>Medium</span>;
      default:
        return <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>Low</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            Equipment Maintenance & Repair Queue
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Track damaged lab hardware, assign technician workflows, and record repair resolutions.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          {['all', 'Reported', 'In Progress', 'Resolved'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                border: 'none',
                background: filter === tab ? '#ffffff' : 'transparent',
                color: filter === tab ? '#0f172a' : '#64748b',
                fontWeight: filter === tab ? 600 : 500,
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                boxShadow: filter === tab ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {tab === 'all' ? 'All Tickets' : tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Wrench size={36} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
            <p>No maintenance tickets match the selected status.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {item.asset_tag}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
                      {item.equipment_name}
                    </h3>
                    {getSeverityBadge(item.severity)}
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    <span>Laboratory: <strong>{item.laboratory_name}</strong></span>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span>Reported by: <strong>{item.reported_by}</strong></span>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span>{new Date(item.reported_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {item.status === 'Reported' && (
                    <button
                      disabled={updatingId === item.id}
                      onClick={() => handleStatusChange(item.id, 'In Progress')}
                      className="btn btn-warning"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                    >
                      <Clock size={14} />
                      Start Work
                    </button>
                  )}

                  {item.status === 'In Progress' && (
                    <button
                      disabled={updatingId === item.id}
                      onClick={() => handleStatusChange(item.id, 'Resolved')}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                    >
                      <CheckCircle size={14} />
                      Mark Resolved
                    </button>
                  )}

                  <span className="badge" style={{
                    background: item.status === 'Resolved' ? '#ecfdf5' : item.status === 'In Progress' ? '#fffbeb' : '#fef2f2',
                    color: item.status === 'Resolved' ? '#047857' : item.status === 'In Progress' ? '#b45309' : '#b91c1c'
                  }}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                  FAULT DETAILS:
                </div>
                <p style={{ fontSize: '0.875rem', color: '#334155' }}>
                  {item.issue_description}
                </p>

                {item.resolution_notes && (
                  <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>
                      RESOLUTION SUMMARY:
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#065f46' }}>
                      {item.resolution_notes}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Repair Cost: ${Number(item.cost || 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
