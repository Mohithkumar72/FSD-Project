import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function EquipmentFilterBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedLab,
  setSelectedLab,
  selectedStatus,
  setSelectedStatus,
  categories,
  laboratories,
  onReset
}) {
  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
        gap: '0.85rem',
        alignItems: 'center'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by name, asset tag, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Laboratory Filter */}
        <div>
          <select
            className="form-control"
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
          >
            <option value="all">All Laboratories</option>
            {laboratories.map(lab => (
              <option key={lab.id} value={lab.id}>
                {lab.name} ({lab.code})
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            className="form-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Damaged">Damaged</option>
            <option value="Decommissioned">Decommissioned</option>
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className="btn btn-secondary"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
