import React, { useEffect, useState, useCallback } from 'react';
import { ItemsAPI, AuthAPI } from '../services/api';

export default function Dashboard() {
  // Page background image with subtle dark overlay
  useEffect(() => {
    const prev = {
      background: document.body.style.background,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundAttachment: document.body.style.backgroundAttachment,
    };

    // 75% transparent dark overlay over the background image
    document.body.style.background = `
      linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)),
      url('/src/assests/1.jpg') center / cover no-repeat fixed
    `;
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.background = prev.background || '#f8fafc';
      document.body.style.backgroundSize = prev.backgroundSize || '';
      document.body.style.backgroundPosition = prev.backgroundPosition || '';
      document.body.style.backgroundAttachment = prev.backgroundAttachment || '';
    };
  }, []);

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', amount: '' });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchMe = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in. Please login again.');
      setUser(null);
      return;
    }
    setLoading(true);
    AuthAPI.me()
      .then((data) => {
        setUser(data.user);
        setError(null);
        // Also check DB status and load items
        checkDbStatus();
        loadItems();
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

  const loadItems = useCallback(() => {
    setItemsLoading(true);
    ItemsAPI.list()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error('Load items failed', err);
        setError(err.message);
      })
      .finally(() => setItemsLoading(false));
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const resetForm = () => setForm({ title: '', description: '', amount: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || form.amount === '') return setError('Please fill title and amount');
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description, amount: Number(form.amount) };
      await ItemsAPI.create(payload);
      resetForm();
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({ title: item.title, description: item.description || '', amount: item.amount.toString() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description, amount: Number(form.amount) };
      await ItemsAPI.update(editingId, payload);
      cancelEdit();
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await ItemsAPI.remove(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '1.5rem', background: 'rgba(255,255,255,0.9)', borderRadius: '18px', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.4)' }}>
      <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#2c3e50' }}>Welcome to Your Dashboard</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
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
      </div>

      {loading && <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>Loading your profile...</div>}
      {error && <div style={{ padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px' }}>{error}</div>}
      
      {user && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#3498db', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Your Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
            <div style={{ background:'#f8fafc', padding:'12px 16px', borderRadius:8 }}>
              <div style={{ fontSize:12, color:'#64748b' }}>Name</div>
              <div style={{ fontWeight:600 }}>{user.name}</div>
            </div>
            <div style={{ background:'#f8fafc', padding:'12px 16px', borderRadius:8 }}>
              <div style={{ fontSize:12, color:'#64748b' }}>Email</div>
              <div style={{ fontWeight:600 }}>{user.email}</div>
            </div>
            <div style={{ background:'#f8fafc', padding:'12px 16px', borderRadius:8 }}>
              <div style={{ fontSize:12, color:'#64748b' }}>Member Since</div>
              <div style={{ fontWeight:600 }}>{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ background:'#f8fafc', padding:'12px 16px', borderRadius:8 }}>
              <div style={{ fontSize:12, color:'#64748b' }}>User ID</div>
              <div style={{ fontWeight:600 }}>{user.id}</div>
            </div>
          </div>
        </div>
      )}

      {/* Items CRUD Section */}
      <section>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: '1rem' }}>
          <h3 style={{ color: '#16a34a' }}>Your Items</h3>
          <button onClick={loadItems} disabled={itemsLoading}
            style={{ padding:'10px 16px', background: itemsLoading ? '#94a3b8' : 'linear-gradient(135deg, #22c55e, #16a34a)', color:'#fff', border:'none', borderRadius:8, cursor: itemsLoading? 'not-allowed' : 'pointer' }}>
            {itemsLoading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        {/* Create / Edit form */}
        <form onSubmit={editingId ? handleUpdate : handleCreate}
          style={{ display:'grid', gridTemplateColumns:'2fr 3fr 1fr auto', gap:12, background:'#f1f5f9', padding:16, borderRadius:12, marginBottom:16 }}>
          <input placeholder="Title" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))}
            style={{ padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8 }} />
          <input placeholder="Description" value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))}
            style={{ padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8 }} />
          <input type="number" step="0.01" min="0" placeholder="Amount" value={form.amount}
            onChange={(e)=>setForm(f=>({...f,amount:e.target.value}))}
            style={{ padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8 }} />
          <div style={{ display:'flex', gap:8 }}>
            <button type="submit" disabled={saving}
              style={{ padding:'10px 16px', background: saving ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color:'#fff', border:'none', borderRadius:8, cursor: saving? 'not-allowed' : 'pointer', fontWeight:600 }}>
              {editingId ? (saving ? 'Saving...' : 'Save') : (saving ? 'Adding...' : 'Add')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit}
                style={{ padding:'10px 16px', background:'#e2e8f0', color:'#334155', border:'none', borderRadius:8, fontWeight:600 }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Items list */}
        <div style={{ display:'grid', gap:12 }}>
          {items.length === 0 && !itemsLoading && (
            <div style={{ padding:16, border:'1px dashed #cbd5e1', borderRadius:12, color:'#64748b' }}>
              No items yet. Add your first item above.
            </div>
          )}
          {items.map((item) => (
            <div key={item._id} style={{ display:'grid', gridTemplateColumns:'2fr 3fr 1fr auto', gap:12, alignItems:'center', padding:16, border:'1px solid #e2e8f0', borderRadius:12 }}>
              <div>
                <div style={{ fontWeight:700 }}>{item.title}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>Created {new Date(item.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ color:'#334155' }}>{item.description || '—'}</div>
              <div style={{ fontWeight:700, color:'#0ea5e9' }}>${Number(item.amount).toFixed(2)}</div>
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                <button onClick={()=>startEdit(item)}
                  style={{ padding:'8px 12px', background:'#fde68a', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>
                  Edit
                </button>
                <button onClick={()=>handleDelete(item._id)}
                  style={{ padding:'8px 12px', background:'#fca5a5', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, color:'#7f1d1d' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
