import React, { useEffect, useState, useCallback } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  const fetchMe = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in. Please login again.');
      setUser(null);
      return;
    }
    setLoading(true);
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error');
        setUser(data.user);
        setError(null);
        // Also check DB status
        checkDbStatus();
      })
      .catch(err => {
        console.error('ME endpoint error', err);
        setError(err.message);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const checkDbStatus = useCallback(() => {
    fetch('/api/test/db')
      .then(res => res.json())
      .then(data => {
        setDbStatus(data);
      })
      .catch(err => {
        console.error('DB status check failed', err);
      });
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError('Logged out');
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#2c3e50' }}>Welcome to Your Dashboard</h2>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
        <button 
          onClick={fetchMe} 
          disabled={loading}
          style={{ 
            padding: '14px 28px',
            background: loading ? '#bdc3c7' : 'linear-gradient(145deg, #27ae60, #2ecc71)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: loading ? 'none' : '0 8px 25px rgba(46, 204, 113, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(46, 204, 113, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(46, 204, 113, 0.4)';
            }
          }}
        >
          {loading ? 'Loading...' : 'Refresh Profile'}
        </button>
        <button 
          onClick={logout} 
          style={{ 
            padding: '14px 28px',
            background: 'linear-gradient(145deg, #e67e22, #f39c12)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 8px 25px rgba(243, 156, 18, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(243, 156, 18, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(243, 156, 18, 0.4)';
          }}
        >
          Logout
        </button>
      </div>

      {loading && <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>Loading your profile...</div>}
      {error && <div style={{ padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px' }}>{error}</div>}
      
      {user && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#3498db', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Your Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
            <span style={{ fontWeight: 'bold' }}>Name:</span>
            <span>{user.name}</span>
            
            <span style={{ fontWeight: 'bold' }}>Email:</span>
            <span>{user.email}</span>
            
            <span style={{ fontWeight: 'bold' }}>Member Since:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            
            <span style={{ fontWeight: 'bold' }}>User ID:</span>
            <span>{user.id}</span>
          </div>
        </div>
      )}
      
      {!user && !loading && !error && <p>No user data loaded. Please log in again.</p>}
      {!user && error === 'Logged out' && (
        <div style={{ padding: '1rem', background: '#e8f5e9', color: '#388e3c', borderRadius: '4px', marginTop: '1rem' }}>
          You have been logged out. <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Return to login page</a>
        </div>
      )}

      {dbStatus && (
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666', padding: '1rem', background: '#f5f5f5', borderRadius: '4px', display: 'none' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#444' }}>Database Status (Debug)</h4>
          <div>Connected: <span style={{ color: dbStatus.connected ? 'green' : 'red', fontWeight: 'bold' }}>{dbStatus.connected ? 'Yes' : 'No'}</span></div>
          <div>Database: {dbStatus.databaseName}</div>
          <div>Users collection: <span style={{ color: dbStatus.users?.collectionExists ? 'green' : 'orange' }}>
            {dbStatus.users?.collectionExists ? 'Created' : 'Not created yet'}
          </span></div>
          <div>User count: {dbStatus.users?.count || 0}</div>
        </div>
      )}
    </div>
  );
}