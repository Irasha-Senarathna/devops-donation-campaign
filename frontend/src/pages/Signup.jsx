import React, { useState, useEffect } from 'react';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const prev = {
      background: document.body.style.background,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundAttachment: document.body.style.backgroundAttachment,
    };

    document.body.style.background = '#0f172a';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.background = prev.background || '#f8fafc';
      document.body.style.backgroundSize = prev.backgroundSize || '';
      document.body.style.backgroundPosition = prev.backgroundPosition || '';
      document.body.style.backgroundAttachment = prev.backgroundAttachment || '';
    };
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      localStorage.setItem('token', data.token);
      window.location = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '650px',
        height: '650px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(85px)',
        animation: 'float 28s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '750px',
        height: '750px',
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(95px)',
        animation: 'float 32s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(75px)',
        animation: 'pulse 18s ease-in-out infinite'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -50px) scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.8); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '520px',
        animation: 'slideIn 0.8s ease-out'
      }}>
        {/* Logo/Brand Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            borderRadius: '22px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 40px rgba(249, 115, 22, 0.5)',
            animation: 'glow 3s ease-in-out infinite',
            transform: 'rotate(-5deg)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s infinite'
            }} />
            <span style={{
              fontSize: '2.8rem',
              transform: 'rotate(5deg)',
              position: 'relative',
              zIndex: 1
            }}>🚀</span>
          </div>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Join Us Today
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '1.1rem',
            fontWeight: '300'
          }}>
            Create your account and start making a difference
          </p>
        </div>

        {/* Signup Card */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Name Input */}
            <div>
              <label style={{
                display: 'block',
                color: '#f97316',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                letterSpacing: '0.5px'
              }}>
                FULL NAME 
              </label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={onChange}
                required
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem 1.25rem',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: '400',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(249, 115, 22, 0.6)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.15)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.9)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(249, 115, 22, 0.3)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(15, 23, 42, 0.7)';
                }}
              />
            </div>

            {/* Email Input */}
            <div>
              <label style={{
                display: 'block',
                color: '#f97316',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                letterSpacing: '0.5px'
              }}>
                EMAIL ADDRESS
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={onChange}
                required
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem 1.25rem',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: '400',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(249, 115, 22, 0.6)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.15)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.9)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(249, 115, 22, 0.3)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(15, 23, 42, 0.7)';
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                color: '#f97316',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                letterSpacing: '0.5px'
              }}>
                PASSWORD
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={onChange}
                required
                minLength={6}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem 1.25rem',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: '400',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(249, 115, 22, 0.6)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.15)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.9)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(249, 115, 22, 0.3)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(15, 23, 42, 0.7)';
                }}
              />
              <p style={{
                color: '#64748b',
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                fontWeight: '400'
              }}>
                Minimum 6 characters
              </p>
            </div>

            {/* Terms & Conditions */}
            <div style={{
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '10px',
              border: '1px solid rgba(249, 115, 22, 0.15)'
            }}>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.85rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                By creating an account, you agree to our{' '}
                <a href="#" style={{ color: '#fb923c', textDecoration: 'none', fontWeight: '600' }}>
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" style={{ color: '#fb923c', textDecoration: 'none', fontWeight: '600' }}>
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Signup Button */}
            <button
              onClick={submit}
              style={{
                width: '100%',
                padding: '1.1rem 2rem',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                letterSpacing: '0.5px',
                marginTop: '0.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(249, 115, 22, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 30px rgba(249, 115, 22, 0.4)';
              }}
            >
              Create Account
            </button>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#fca5a5',
                fontSize: '0.95rem',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          padding: '1.5rem',
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(249, 115, 22, 0.15)'
        }}>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1rem',
            margin: 0
          }}>
            Already have an account?{' '}
            <a
              href="/login"
              style={{
                color: '#f97316',
                textDecoration: 'none',
                fontWeight: '700',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#fb923c';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#f97316';
              }}
            >
              Sign In
            </a>
          </p>
        </div>

        {/* Features */}
        <div style={{
          marginTop: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          {[
            { icon: '🔒', text: 'Secure' },
            { icon: '⚡', text: 'Fast Setup' },
            { icon: '✨', text: 'Easy to Use' }
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(249, 115, 22, 0.1)'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {feature.icon}
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: 0,
                fontWeight: '500'
              }}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}