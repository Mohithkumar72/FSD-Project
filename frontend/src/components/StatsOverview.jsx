import React from 'react';
import { Package, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function StatsOverview({ summary = {} }) {
  const stats = [
    {
      label: 'Total Equipment',
      value: summary.totalEquipment || 0,
      icon: Package,
      color: '#2563eb',
      bgColor: '#eff6ff'
    },
    {
      label: 'Available in Labs',
      value: summary.availableCount || 0,
      icon: CheckCircle2,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      label: 'Allocated to Users',
      value: summary.allocatedCount || 0,
      icon: Clock,
      color: '#8b5cf6',
      bgColor: '#f5f3ff'
    },
    {
      label: 'Under Maintenance / Damaged',
      value: (summary.underMaintenanceCount || 0) + (summary.damagedCount || 0),
      icon: AlertTriangle,
      color: '#ef4444',
      bgColor: '#fef2f2'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: s.bgColor,
              color: s.color,
              padding: '0.85rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
