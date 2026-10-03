import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getDashboardSummary,
  getDashboardAnalytics,
} from '../../services/dashboardService';
import './Admin.css';

const STATUS_LABELS = {
  Pending: 'Beklemede',
  Confirmed: 'Onaylandı',
  Preparing: 'Hazırlanıyor',
  OutForDelivery: 'Dağıtımda',
  Delivered: 'Teslim Edildi',
  Cancelled: 'İptal Edildi',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [summaryData, analyticsData] = await Promise.all([
          getDashboardSummary(),
          getDashboardAnalytics(),
        ]);

        setSummary(summaryData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Dashboard verileri alınamadı:', error);
        setError('Dashboard verileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <p className="admin-dashboard-message">
        Dashboard yükleniyor...
      </p>
    );
  }

  if (error) {
    return (
      <p className="admin-dashboard-message admin-error">
        {error}
      </p>
    );
  }

  if (!summary || !analytics) {
    return (
      <p className="admin-dashboard-message admin-error">
        Dashboard verileri bulunamadı.
      </p>
    );
  }

  const maxMonthlyRevenue = Math.max(
    ...analytics.monthlySales.map((month) => month.revenue),
    1
  );

  const maxStatusCount = Math.max(
    ...analytics.orderStatusBreakdown.map((status) => status.count),
    1
  );

  return (
    <div className="admin-page admin-dashboard">
      <span className="admin-dashboard-eyebrow">
        Bloom Flowers / Admin
      </span>

      <h1 className="admin-dashboard-title">
        Dashboard
      </h1>

      <p className="admin-dashboard-subtitle">
        Mağazanızın genel görünümü.
      </p>

      <div className="dashboard-stats">
        <div className="dashboard-stat">
          <span className="dashboard-stat-label">
            Toplam Satış
          </span>

          <span className="dashboard-stat-value">
            {formatCurrency(summary.totalRevenue)} ₺
          </span>
        </div>

        <div className="dashboard-stat">
          <span className="dashboard-stat-label">
            Sipariş
          </span>

          <span className="dashboard-stat-value">
            {summary.totalOrders}
          </span>
        </div>

        <div className="dashboard-stat">
          <span className="dashboard-stat-label">
            Bekleyen
          </span>

          <span className="dashboard-stat-value">
            {summary.pendingOrders}
          </span>
        </div>

        <div className="dashboard-stat">
          <span className="dashboard-stat-label">
            Ürün
          </span>

          <span className="dashboard-stat-value">
            {summary.totalProducts}
          </span>
        </div>

        <div className="dashboard-stat">
          <span className="dashboard-stat-label">
            Müşteri
          </span>

          <span className="dashboard-stat-value">
            {summary.totalCustomers}
          </span>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="dashboard-panel">
          <h2 className="dashboard-panel-title">
            Satış Analizi
          </h2>

          {analytics.monthlySales.length === 0 ? (
            <p className="dashboard-empty">
              Henüz satış verisi yok.
            </p>
          ) : (
            <div className="sales-chart">
              {analytics.monthlySales.map((month) => (
                <div
                  className="sales-chart-col"
                  key={month.month}
                >
                  <span className="sales-chart-value">
                    {formatCurrency(month.revenue)} ₺
                  </span>

                  <div
                    className="sales-chart-bar"
                    style={{
                      height: `${
                        (month.revenue / maxMonthlyRevenue) * 100
                      }%`,
                    }}
                  />

                  <span className="sales-chart-label">
                    {month.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <h2 className="dashboard-panel-title">
            Sipariş Durumları
          </h2>

          <div className="status-chart">
            {analytics.orderStatusBreakdown.map((item) => (
              <div
                className="status-chart-row"
                key={item.status}
              >
                <span className="status-chart-label">
                  {STATUS_LABELS[item.status] || item.status}
                </span>

                <div className="status-chart-track">
                  <div
                    className="status-chart-bar"
                    style={{
                      width: `${
                        (item.count / maxStatusCount) * 100
                      }%`,
                    }}
                  />
                </div>

                <span className="status-chart-count">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-panel">
        <h2 className="dashboard-panel-title">
          En Çok Satan Ürünler
        </h2>

        {analytics.topProducts.length === 0 ? (
          <p className="dashboard-empty">
            Henüz satış verisi yok.
          </p>
        ) : (
          <div className="top-products-list">
            {analytics.topProducts.map((product, index) => (
              <div
                className="top-products-row"
                key={product.productId}
              >
                <span className="top-products-index">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="top-products-name">
                  {product.productName}
                </span>

                <span className="top-products-quantity">
                  {product.totalQuantitySold} adet
                </span>

                <span className="top-products-revenue">
                  {formatCurrency(product.totalRevenue)} ₺
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-panel">
        <h2 className="dashboard-panel-title">
          Hızlı İşlemler
        </h2>

        <div className="quick-actions">
          <Link
            to="/admin/products"
            className="quick-action"
          >
            + Ürün
          </Link>

          <Link
            to="/admin/categories"
            className="quick-action"
          >
            + Kategori
          </Link>

          <Link
            to="/admin/orders"
            className="quick-action"
          >
            Siparişler
          </Link>

          <Link
            to="/admin/products"
            className="quick-action"
          >
            Ürünler
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;