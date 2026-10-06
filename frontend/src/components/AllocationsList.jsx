import React from 'react';
import { CheckCircle2, Calendar, User, BookOpen } from 'lucide-react';

export default function AllocationsList({ allocations, onReturnAllocation }) {
  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
          Equipment Allocation Records
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
          Real-time checkouts and loans to students and faculty for coursework, research, and lab projects.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
        {allocations.map(a => (
          <div key={a.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                  {a.asset_tag}
                </span>
                <span className={`badge ${a.status === 'Active' ? 'badge-allocated' : 'badge-available'}`}>
                  {a.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                {a.equipment_name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                <User size={15} color="#64748b" />
                <span><strong>{a.borrower_name}</strong> ({a.borrower_role})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>
                <Calendar size={15} color="#64748b" />
                <span>Due: {new Date(a.expected_return_date).toLocaleDateString()}</span>
                {a.actual_return_date && (
                  <span style={{ color: '#059669' }}>(Returned: {new Date(a.actual_return_date).toLocaleDateString()})</span>
                )}
              </div>

              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8125rem', color: '#475569' }}>
                <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.2rem' }}>PURPOSE:</div>
                {a.purpose}
              </div>
            </div>

            {a.status === 'Active' && (
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => onReturnAllocation(a.id)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CheckCircle2 size={16} color="#10b981" />
                  Mark as Returned
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
