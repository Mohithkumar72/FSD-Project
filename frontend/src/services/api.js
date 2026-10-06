const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Equipment
  async getEquipment(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/equipment${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getEquipmentById(id) {
    const res = await fetch(`${API_BASE}/equipment/${id}`);
    return res.json();
  },

  async createEquipment(data) {
    const res = await fetch(`${API_BASE}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateEquipment(id, data) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteEquipment(id) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async updateEquipmentStatus(id, status) {
    const res = await fetch(`${API_BASE}/equipment/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Maintenance & Damage Reporting
  async getMaintenance() {
    const res = await fetch(`${API_BASE}/maintenance`);
    return res.json();
  },

  async reportDamage(data) {
    const res = await fetch(`${API_BASE}/maintenance/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateMaintenanceStatus(id, status, notes = '', cost = 0) {
    const res = await fetch(`${API_BASE}/maintenance/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolution_notes: notes, cost })
    });
    return res.json();
  },

  // Allocations
  async getAllocations() {
    const res = await fetch(`${API_BASE}/allocations`);
    return res.json();
  },

  async createAllocation(data) {
    const res = await fetch(`${API_BASE}/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async returnAllocation(id) {
    const res = await fetch(`${API_BASE}/allocations/${id}/return`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Metadata & Analytics
  async getLaboratories() {
    const res = await fetch(`${API_BASE}/laboratories`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  async getSummary() {
    const res = await fetch(`${API_BASE}/reports/summary`);
    return res.json();
  }
};
