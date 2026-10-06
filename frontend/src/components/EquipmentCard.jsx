import React from 'react';
import { Tag, MapPin, Eye, Wrench, Share2, Trash2 } from 'lucide-react';

export default function EquipmentCard({
  item,
  onViewDetails,
  onReportDamage,
  onAllocate,
  onDelete
}) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Available': return 'badge-available';
      case 'Allocated': return 'badge-allocated';
      case 'Under Maintenance': return 'badge-under-maintenance';
      case 'Damaged': return 'badge-damaged';
      default: return 'badge-decommissioned';
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            {item.asset_tag}
          </span>
          <span className={`badge ${getBadgeClass(item.status)}`}>
            {item.status}
          </span>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {item.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.35rem' }}>
          <Tag size={14} />
          <span>{item.category_name}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>
          <MapPin size={14} />
          <span>{item.laboratory_name} ({item.room_no || 'Main'})</span>
        </div>

        {item.specifications && (
          <p style={{
            fontSize: '0.8125rem',
            color: '#64748b',
            lineHeight: 1.4,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {item.specifications}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.85rem',
        borderTop: '1px solid #f1f5f9',
        marginTop: '0.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => onViewDetails(item)}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.65rem' }}
            title="View Details"
          >
            <Eye size={15} />
          </button>
          
          <button
            onClick={() => onReportDamage(item)}
            className="btn btn-warning"
            style={{ padding: '0.4rem 0.65rem' }}
            title="Report Damage / Issue"
          >
            <Wrench size={15} />
          </button>

          {item.status === 'Available' && (
            <button
              onClick={() => onAllocate(item)}
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.65rem' }}
              title="Allocate Equipment"
            >
              <Share2 size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => onDelete(item.id)}
          className="btn btn-danger"
          style={{ padding: '0.4rem 0.65rem' }}
          title="Delete Equipment"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
