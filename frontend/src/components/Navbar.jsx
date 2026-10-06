import React from 'react';
import { Microscope, LayoutDashboard, Wrench, Package, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddModal }) {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.85rem',
        paddingBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            padding: '0.6rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
          }}>
            <Microscope size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              LabEquip Core
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              College Laboratory Equipment Management System
            </p>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('inventory')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'inventory' ? '#eff6ff' : 'transparent',
              color: activeTab === 'inventory' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'inventory' ? 600 : 500
            }}
          >
            <Package size={17} />
            Equipment
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'maintenance' ? '#eff6ff' : 'transparent',
              color: activeTab === 'maintenance' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'maintenance' ? 600 : 500
            }}
          >
            <Wrench size={17} />
            Maintenance
          </button>

          <button
            onClick={() => setActiveTab('allocations')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'allocations' ? '#eff6ff' : 'transparent',
              color: activeTab === 'allocations' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'allocations' ? 600 : 500
            }}
          >
            <Layers size={17} />
            Allocations
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'dashboard' ? '#eff6ff' : 'transparent',
              color: activeTab === 'dashboard' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'dashboard' ? 600 : 500
            }}
          >
            <LayoutDashboard size={17} />
            Analytics & Reports
          </button>

          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{ marginLeft: '0.75rem' }}
          >
            + Add Equipment
          </button>
        </nav>
      </div>
    </header>
  );
}
