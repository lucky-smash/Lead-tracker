import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics`),
        fetch(`${API_URL}/api/leads`),
      ]);

      const analyticsData = await analyticsRes.json();
      const leadsData = await leadsRes.json();

      setAnalytics(analyticsData);
      setLeads(leadsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  if (loading && !analytics) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    { icon: '👥', label: 'Total Leads', value: analytics?.totalLeads || 0, color: 'indigo' },
    { icon: '📧', label: 'Emails Sent', value: analytics?.emailsSent || 0, color: 'cyan' },
    { icon: '📬', label: 'Emails Opened', value: analytics?.emailsOpened || 0, color: 'emerald' },
    { icon: '📊', label: 'Open Rate', value: `${analytics?.openRate || 0}%`, color: 'amber' },
    { icon: '🔗', label: 'Links Clicked', value: analytics?.linksClicked || 0, color: 'rose' },
    { icon: '📈', label: 'Click Rate', value: `${analytics?.clickRate || 0}%`, color: 'purple' },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Real-time email engagement tracking & lead insights</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="table-section">
        <div className="table-header">
          <h2>Recent Leads</h2>
          <button className="refresh-btn" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No leads yet. Submit your first lead using the form!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Requirement</th>
                  <th>Email Opened</th>
                  <th>Link Clicked</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <span className="lead-name">{lead.name}</span>
                      {lead.company && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lead.company}</div>}
                    </td>
                    <td><span className="lead-email">{lead.email}</span></td>
                    <td>{lead.phone}</td>
                    <td><span className="requirement-text" title={lead.requirement}>{lead.requirement}</span></td>
                    <td>
                      <span className={`badge ${lead.opened ? 'opened' : 'not-opened'}`}>
                        {lead.opened ? '✅ Opened' : '— No'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${lead.clicked ? 'clicked' : 'not-clicked'}`}>
                        {lead.clicked ? '🔗 Clicked' : '— No'}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
