import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import EquipmentFilterBar from './components/EquipmentFilterBar';
import EquipmentCard from './components/EquipmentCard';
import EquipmentDetailModal from './components/EquipmentDetailModal';
import EquipmentFormModal from './components/EquipmentFormModal';
import ReportDamageModal from './components/ReportDamageModal';
import AllocationModal from './components/AllocationModal';
import MaintenanceTracker from './components/MaintenanceTracker';
import AllocationsList from './components/AllocationsList';
import AdminDashboard from './components/AdminDashboard';
import { api } from './services/api';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('inventory');

  // Master Data State
  const [equipmentList, setEquipmentList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [users, setUsers] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [allocationsList, setAllocationsList] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLab, setSelectedLab] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal State
  const [detailItem, setDetailItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [damageTarget, setDamageTarget] = useState(null);
  const [allocationTarget, setAllocationTarget] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    fetchMetadata();
    fetchEquipment();
    fetchMaintenance();
    fetchAllocations();
    fetchSummary();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [cats, labs, usr] = await Promise.all([
        api.getCategories(),
        api.getLaboratories(),
        api.getUsers()
      ]);
      if (cats.success) setCategories(cats.data);
      if (labs.success) setLaboratories(labs.data);
      if (usr.success) setUsers(usr.data);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      const res = await api.getEquipment();
      if (res.success) setEquipmentList(res.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  };

  const fetchMaintenance = async () => {
    try {
      const res = await api.getMaintenance();
      if (res.success) setMaintenanceList(res.data);
    } catch (err) {
      console.error('Error fetching maintenance:', err);
    }
  };

  const fetchAllocations = async () => {
    try {
      const res = await api.getAllocations();
      if (res.success) setAllocationsList(res.data);
    } catch (err) {
      console.error('Error fetching allocations:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.getSummary();
      if (res.success) setSummaryData(res);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const refreshAll = () => {
    fetchEquipment();
    fetchMaintenance();
    fetchAllocations();
    fetchSummary();
  };

  // Equipment Actions
  const handleAddEquipment = async (payload) => {
    const res = await api.createEquipment(payload);
    if (!res.success) throw new Error(res.errors?.join(', ') || res.message);
    refreshAll();
  };

  const handleDeleteEquipment = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      const res = await api.deleteEquipment(id);
      if (res.success) refreshAll();
    }
  };

  const handleReportDamageSubmit = async (payload) => {
    const res = await api.reportDamage(payload);
    if (!res.success) throw new Error(res.errors?.join(', ') || res.message);
    refreshAll();
  };

  const handleAllocateSubmit = async (payload) => {
    const res = await api.createAllocation(payload);
    if (!res.success) throw new Error(res.errors?.join(', ') || res.message);
    refreshAll();
  };

  const handleReturnAllocation = async (id) => {
    const res = await api.returnAllocation(id);
    if (res.success) refreshAll();
  };

  const handleUpdateMaintenanceStatus = async (id, status, notes, cost) => {
    const res = await api.updateMaintenanceStatus(id, status, notes, cost);
    if (res.success) refreshAll();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLab('all');
    setSelectedStatus('all');
  };

  // Dynamic list filtering using filter() and map()
  const filteredEquipment = equipmentList.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
      (item.model_number && item.model_number.toLowerCase().includes(search.toLowerCase()));

    const matchesLab = selectedLab === 'all' || String(item.laboratory_id) === String(selectedLab);
    const matchesCategory = selectedCategory === 'all' || String(item.category_id) === String(selectedCategory);
    const matchesStatus = selectedStatus === 'all' || item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesLab && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* KPI Summary Cards */}
        {summaryData && <StatsOverview summary={summaryData.summary} />}

        {/* Inventory View */}
        {activeTab === 'inventory' && (
          <div>
            <EquipmentFilterBar
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLab={selectedLab}
              setSelectedLab={setSelectedLab}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              categories={categories}
              laboratories={laboratories}
              onReset={handleResetFilters}
            />

            {filteredEquipment.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No equipment matches the search and filter criteria.</p>
                <button onClick={handleResetFilters} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem'
              }}>
                {filteredEquipment.map(item => (
                  <EquipmentCard
                    key={item.id}
                    item={item}
                    onViewDetails={(eq) => setDetailItem(eq)}
                    onReportDamage={(eq) => setDamageTarget(eq)}
                    onAllocate={(eq) => setAllocationTarget(eq)}
                    onDelete={handleDeleteEquipment}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Maintenance Tracker View */}
        {activeTab === 'maintenance' && (
          <MaintenanceTracker
            maintenanceList={maintenanceList}
            onUpdateStatus={handleUpdateMaintenanceStatus}
          />
        )}

        {/* Allocations View */}
        {activeTab === 'allocations' && (
          <AllocationsList
            allocations={allocationsList}
            onReturnAllocation={handleReturnAllocation}
          />
        )}

        {/* Admin Analytics View */}
        {activeTab === 'dashboard' && (
          <AdminDashboard summaryData={summaryData} />
        )}
      </main>

      {/* Modals */}
      {detailItem && (
        <EquipmentDetailModal
          equipment={detailItem}
          onClose={() => setDetailItem(null)}
          onReportDamage={(eq) => setDamageTarget(eq)}
          onAllocate={(eq) => setAllocationTarget(eq)}
        />
      )}

      {showAddModal && (
        <EquipmentFormModal
          categories={categories}
          laboratories={laboratories}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddEquipment}
        />
      )}

      {damageTarget && (
        <ReportDamageModal
          equipment={damageTarget}
          users={users}
          onClose={() => setDamageTarget(null)}
          onSuccess={handleReportDamageSubmit}
        />
      )}

      {allocationTarget && (
        <AllocationModal
          equipment={allocationTarget}
          users={users}
          onClose={() => setAllocationTarget(null)}
          onSuccess={handleAllocateSubmit}
        />
      )}
    </div>
  );
}
