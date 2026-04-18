'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Complaint {
  id: string;
  complaint_id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  citizen_name: string;
  citizen_phone?: string;
  created_at: string;
}

const statusColors: { [key: string]: string } = {
  registered: 'var(--blue)',
  assigned: 'var(--orange)',
  in_progress: 'var(--orange)',
  resolved: 'var(--green)',
  rejected: '#c00',
  escalated: '#d9a600',
  on_hold: '#666',
};

const priorityColors: { [key: string]: string } = {
  low: '#666',
  medium: 'var(--orange)',
  high: '#d00',
  critical: '#c00',
};

export default function OfficerDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    // Check if user is authenticated
    const session = sessionStorage.getItem('vmc_session');
    const userId = sessionStorage.getItem('vmc_user_id');
    const userType = sessionStorage.getItem('vmc_user_type');
    
    if (!session || !userId) {
      // Not authenticated - redirect to home
      console.log('[v0] No session found, redirecting to home');
      router.push('/');
      return;
    }
    
    // Verify session is still valid (simple check)
    try {
      const decoded = JSON.parse(atob(session));
      const loginTime = new Date(decoded.loginTime).getTime();
      const now = new Date().getTime();
      
      if (now - loginTime > decoded.expiresIn) {
        // Session expired
        sessionStorage.removeItem('vmc_session');
        sessionStorage.removeItem('vmc_user_id');
        sessionStorage.removeItem('vmc_user_type');
        router.push('/');
        return;
      }
    } catch (e) {
      // Invalid session format
      router.push('/');
      return;
    }
    
    setIsAuthenticated(true);
    setUserInfo({ userId, userType });
    fetchComplaints();
  }, [router]);

  useEffect(() => {
    applyFilters();
  }, [complaints, searchQuery, statusFilter, priorityFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/complaints/list');
      if (!response.ok) throw new Error('Failed to fetch complaints');
      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = complaints;

    if (searchQuery.trim()) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.complaint_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.citizen_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    setFilteredComplaints(filtered);
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--off)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--text2)'
        }}>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off)', padding: '0' }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '0.02em'
          }}>
            Officer Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {userInfo && (
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text2)',
                background: 'var(--off)',
                padding: '6px 12px',
                borderRadius: 'var(--radius)'
              }}>
                {userInfo.userId}
              </span>
            )}
            <button
              onClick={() => {
                sessionStorage.removeItem('vmc_session');
                sessionStorage.removeItem('vmc_user_id');
                sessionStorage.removeItem('vmc_user_type');
                router.push('/');
              }}
              style={{
                padding: '8px 16px',
                background: 'var(--off)',
                border: '1px solid var(--border2)',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--text2)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as any).background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as any).background = 'var(--off)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: '#fff',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Total Complaints
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--navy)' }}>
              {complaints.length}
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              In Progress
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: statusColors['in_progress'] }}>
              {complaints.filter(c => c.status === 'in_progress').length}
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Resolved
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: statusColors['resolved'] }}>
              {complaints.filter(c => c.status === 'resolved').length}
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Critical Priority
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: priorityColors['critical'] }}>
              {complaints.filter(c => c.priority === 'critical').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: '#fff',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text3)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Filters
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ID, title, or citizen name..."
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: '#fff',
                  boxSizing: 'border-box'
                }}
              >
                <option value="all">All Status</option>
                <option value="registered">Registered</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: '#fff',
                  boxSizing: 'border-box'
                }}
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#ffe8e8',
            border: '1px solid rgba(204,0,0,0.2)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            color: '#c00',
            marginBottom: '24px',
            fontSize: '13px'
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Complaints List */}
        {loading ? (
          <div style={{
            background: '#fff',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text2)'
          }}>
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{
            background: '#fff',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text2)'
          }}>
            {complaints.length === 0 ? 'No complaints yet' : 'No complaints match your filters'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => router.push(`/dashboard/complaints/${complaint.id}`)}
                style={{
                  background: '#fff',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '16px',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as any).borderColor = 'var(--navy)';
                  (e.currentTarget as any).background = 'var(--off)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as any).borderColor = 'var(--border)';
                  (e.currentTarget as any).background = '#fff';
                }}
              >
                {/* Status Badge */}
                <div style={{
                  width: '8px',
                  height: '40px',
                  background: statusColors[complaint.status] || '#ccc',
                  borderRadius: '2px'
                }}></div>

                {/* Main Info */}
                <div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '6px', alignItems: 'center' }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--text)',
                      margin: 0
                    }}>
                      {complaint.title}
                    </h3>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      background: 'var(--off)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--text3)',
                      fontFamily: 'monospace',
                      fontWeight: 600
                    }}>
                      {complaint.complaint_id}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text2)',
                    display: 'flex',
                    gap: '16px'
                  }}>
                    <span>{complaint.citizen_name}</span>
                    <span>{complaint.category}</span>
                    <span>{getRelativeTime(complaint.created_at)}</span>
                  </div>
                </div>

                {/* Right Side - Priority & Status */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    background: priorityColors[complaint.priority] + '20',
                    color: priorityColors[complaint.priority],
                    borderRadius: 'var(--radius)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                  }}>
                    {complaint.priority}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    background: statusColors[complaint.status] + '20',
                    color: statusColors[complaint.status],
                    borderRadius: 'var(--radius)',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    letterSpacing: '0.02em'
                  }}>
                    {complaint.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
