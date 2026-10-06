import React from 'react';
import { Database, Server, Building2, Layers, AlertTriangle } from 'lucide-react';

export default function AdminDashboard({ summaryData }) {
  if (!summaryData) return null;

  const {
    summary = {},
    statusDistribution = [],
    labDistribution = [],
    categoryDistribution = [],
    maintenanceSummary = [],
    databaseStatus = {}
  } = summaryData;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
            Administrative Analytics & System Health
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Relational aggregation metrics computed via SQL JOIN, COUNT(*), and GROUP BY operations.
          </p>
        </div>

        {/* Database Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: '#ffffff',
          padding: '0.5rem 0.85rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '0.8125rem'
        }}>
          <Database size={16} color="#2563eb" />
          <span>Active Engine: <strong>{databaseStatus.engine || 'MySQL / Fallback'}</strong></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Lab Breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Building2 size={18} color="#2563eb" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Equipment by Laboratory</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {labDistribution.map(lab => {
              const max = Math.max(...labDistribution.map(l => l.total_equipment), 1);
              const pct = (lab.total_equipment / max) * 100;
              return (
                <div key={lab.laboratory_id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 500, color: '#334155' }}>{lab.laboratory_name}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{lab.total_equipment} units</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Layers size={18} color="#8b5cf6" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Equipment by Category</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {categoryDistribution.map(cat => {
              const max = Math.max(...categoryDistribution.map(c => c.equipment_count), 1);
              const pct = (cat.equipment_count / max) * 100;
              return (
                <div key={cat.category_id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 500, color: '#334155' }}>{cat.category_name}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{cat.equipment_count} units</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#8b5cf6', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Status Breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Server size={18} color="#10b981" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Inventory Status Distribution</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {statusDistribution.map(st => (
              <div key={st.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#334155' }}>{st.status}</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{st.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
