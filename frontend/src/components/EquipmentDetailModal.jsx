import React from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, Calendar, Cpu, Tag } from 'lucide-react';

export default function EquipmentDetailModal({ equipment, onClose, onReportDamage, onAllocate }) {
  if (!equipment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
              {equipment.asset_tag}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              {equipment.name}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>STATUS</div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className="badge badge-available">{equipment.status}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CATEGORY</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '0.25rem' }}>
                {equipment.category_name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>LABORATORY</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '0.25rem' }}>
                {equipment.laboratory_name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Room: {equipment.room_no || 'N/A'} | In-Charge: {equipment.incharge_name || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>MODEL & SERIAL</div>
              <div style={{ fontSize: '0.875rem', color: '#1e293b', marginTop: '0.25rem' }}>
                Model: <strong>{equipment.model_number || 'N/A'}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                S/N: {equipment.serial_number || 'N/A'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginBottom: '0.35rem' }}>
              TECHNICAL SPECIFICATIONS
            </div>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
              {equipment.specifications || 'No detailed specifications recorded.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#64748b" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Purchase Date</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {equipment.purchase_date ? new Date(equipment.purchase_date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#64748b" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Warranty Expiry</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {equipment.warranty_expiry ? new Date(equipment.warranty_expiry).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onReportDamage(equipment);
            }}
            className="btn btn-warning"
          >
            Report Damage
          </button>
          {equipment.status === 'Available' && (
            <button
              onClick={() => {
                onClose();
                onAllocate(equipment);
              }}
              className="btn btn-primary"
            >
              Allocate Equipment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
