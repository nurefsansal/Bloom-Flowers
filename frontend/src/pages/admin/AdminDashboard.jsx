import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../services/dashboardService';
import './Admin.css';

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      const data = await getDashboardSummary();
      setSummary(data);
      setLoading(false);
    }
    fetchSummary();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-card-label">Toplam Sipariş</span>
          <span className="dashboard-card-value">{summary.totalOrders}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Bekleyen Sipariş</span>
          <span className="dashboard-card-value">{summary.pendingOrders}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Toplam Ürün</span>
          <span className="dashboard-card-value">{summary.totalProducts}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Toplam Müşteri</span>
          <span className="dashboard-card-value">{summary.totalCustomers}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Toplam Satış</span>
          <span className="dashboard-card-value">{summary.totalRevenue} ₺</span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;