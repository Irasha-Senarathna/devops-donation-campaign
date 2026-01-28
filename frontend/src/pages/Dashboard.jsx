import React, { useEffect, useState } from 'react';
import { CampaignAPI, AuthAPI, getUserIdFromToken } from '../services/api.js';

const colors = [
  '#f97316', '#fb923c', '#fdba74', '#ff8c42', '#ff6b35', '#f59e0b', '#ea580c'
];

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', targetAmount: 0 });

  const userId = getUserIdFromToken();

  useEffect(() => {
    fetchUser();
    fetchCampaigns();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await AuthAPI.me();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const data = await CampaignAPI.list();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newCampaign = await CampaignAPI.create(form);
      setCampaigns([...campaigns, newCampaign]);
      setForm({ title: '', description: '', targetAmount: 0 });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await CampaignAPI.remove(id);
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDonate = async (id) => {
    const amount = Number(prompt('Enter donation amount'));
    if (!amount || amount <= 0) return;
    try {
      const updated = await CampaignAPI.donate(id, amount);
      setCampaigns(campaigns.map(c => c._id === id ? updated : c));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 25s ease-in-out infinite reverse'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem 2.5rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          animation: 'slideIn 0.6s ease-out'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Welcome back, {user?.name || 'Guest'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '300' }}>
            Manage your campaigns and make a difference
          </p>
        </div>

        {/* Create Campaign Form */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(249, 115, 22, 0.15)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          animation: 'slideIn 0.7s ease-out'
        }}>
          <h2 style={{
            color: '#f97316',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: '#f97316',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            Create New Campaign
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              placeholder="Campaign Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                color: '#e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '400'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(249, 115, 22, 0.6)';
                e.target.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(249, 115, 22, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                color: '#e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '400'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(249, 115, 22, 0.6)';
                e.target.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(249, 115, 22, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <input
              placeholder="Target Amount ($)"
              type="number"
              value={form.targetAmount}
              onChange={e => setForm({ ...form, targetAmount: Number(e.target.value) })}
              required
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                color: '#e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '400'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(249, 115, 22, 0.6)';
                e.target.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(249, 115, 22, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleCreate}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                color: 'white',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(249, 115, 22, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.4)';
              }}
            >
              Create Campaign
            </button>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          animation: 'slideIn 0.8s ease-out'
        }}>
          {campaigns.map((c, index) => {
            const collected = c.donations.reduce((sum, d) => sum + d.amount, 0);
            const progress = Math.min((collected / c.targetAmount) * 100, 100);
            const color = colors[index % colors.length];

            return (
              <div
                key={c._id}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  border: '1px solid rgba(249, 115, 22, 0.15)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.15)';
                }}
              >
                {/* Accent gradient top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${color} 0%, ${colors[(index + 1) % colors.length]} 100%)`
                }} />

                {/* Title Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                  border: `1px solid ${color}40`
                }}>
                  <h3 style={{
                    color: color,
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    margin: 0,
                    letterSpacing: '-0.01em'
                  }}>
                    {c.title}
                  </h3>
                </div>

                <p style={{
                  color: '#cbd5e1',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  fontWeight: '300'
                }}>
                  {c.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '10px',
                  border: '1px solid rgba(249, 115, 22, 0.1)'
                }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.25rem 0', fontWeight: '500' }}>
                      TARGET
                    </p>
                    <p style={{ color: '#f97316', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                      ${c.targetAmount.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.25rem 0', fontWeight: '500' }}>
                      COLLECTED
                    </p>
                    <p style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                      ${collected.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  height: '12px',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(249, 115, 22, 0.2)',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${color} 0%, ${colors[(index + 1) % colors.length]} 100%)`,
                    height: '100%',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 0 10px ${color}80`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      animation: 'shimmer 2s infinite',
                      backgroundSize: '200% 100%'
                    }} />
                  </div>
                </div>

                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  fontWeight: '500'
                }}>
                  {progress.toFixed(1)}% Funded
                </p>

                <button
                  onClick={() => handleDonate(c._id)}
                  style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${color} 0%, ${colors[(index + 1) % colors.length]} 100%)`,
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.9rem',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '0.75rem',
                    boxShadow: `0 4px 15px ${color}50`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = `0 6px 25px ${color}70`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = `0 4px 15px ${color}50`;
                  }}
                >
                  💝 Donate Now
                </button>

                {c.creator._id === userId && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => alert('Edit feature coming soon!')}
                      style={{
                        flex: 1,
                        background: 'rgba(251, 146, 60, 0.2)',
                        border: '1px solid rgba(251, 146, 60, 0.4)',
                        borderRadius: '10px',
                        padding: '0.7rem',
                        color: '#fb923c',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(251, 146, 60, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(251, 146, 60, 0.2)';
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{
                        flex: 1,
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '10px',
                        padding: '0.7rem',
                        color: '#ef4444',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {campaigns.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '20px',
            border: '1px solid rgba(249, 115, 22, 0.15)'
          }}>
            <p style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: '300' }}>
              No campaigns yet. Create your first campaign to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}