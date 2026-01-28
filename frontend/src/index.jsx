import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  body {
    background-color: #0f172a;
    color: #e2e8f0;
    line-height: 1.6;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(60px, -60px) scale(1.25); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }

  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 968px) {
    .hero-grid {
      grid-template-columns: 1fr !important;
      gap: 3rem !important;
    }
    
    .hero-title {
      fontSize: 3rem !important;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 640px) {
    .nav-container {
      flex-wrap: wrap;
      gap: 1rem !important;
    }
    
    .features-grid-home {
      grid-template-columns: 1fr !important;
    }
    
    .stats-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <>
      <style>{styles}</style>
      <BrowserRouter>
        {/* Modern Navigation */}
        <nav style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(249, 115, 22, 0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          animation: 'slideInDown 0.6s ease-out'
        }}>
          <div className="nav-container" style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            {/* Logo */}
            <Link to="/" style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                💝
              </div>
              <span style={{
                fontSize: '1.3rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                DonateNow
              </span>
            </Link>

            {/* Nav Links */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1
            }}>
              <Link to="/" style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(249, 115, 22, 0.1)';
                e.target.style.color = '#f97316';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#e2e8f0';
              }}>
                Home
              </Link>
              
              <Link to="/about" style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(249, 115, 22, 0.1)';
                e.target.style.color = '#f97316';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#e2e8f0';
              }}>
                About
              </Link>

              {token && (
                <Link to="/dashboard" style={{
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(249, 115, 22, 0.1)';
                  e.target.style.color = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#e2e8f0';
                }}>
                  Dashboard
                </Link>
              )}
            </div>

            {/* Auth Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
              {!token ? (
                <>
                  <Link to="/login" style={{
                    color: '#f97316',
                    textDecoration: 'none',
                    fontWeight: '700',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(249, 115, 22, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(249, 115, 22, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}>
                    Login
                  </Link>
                  <Link to="/signup" style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '700',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.3)';
                  }}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  onClick={() => { 
                    localStorage.removeItem('token'); 
                    window.location = '/'; 
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route 
            path="/" 
            element={
              <div style={{
                minHeight: 'calc(100vh - 73px)',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Animated Background Elements */}
                <div style={{
                  position: 'absolute',
                  top: '-10%',
                  right: '-5%',
                  width: '800px',
                  height: '800px',
                  background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(100px)',
                  animation: 'float 30s ease-in-out infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-10%',
                  left: '-5%',
                  width: '900px',
                  height: '900px',
                  background: 'radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(110px)',
                  animation: 'float 35s ease-in-out infinite reverse'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '700px',
                  height: '700px',
                  background: 'radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(90px)',
                  animation: 'pulse 20s ease-in-out infinite'
                }} />

                {/* Hero Section */}
                <div className="hero-grid" style={{
                  position: 'relative',
                  zIndex: 1,
                  maxWidth: '1400px',
                  margin: '0 auto',
                  padding: '6rem 2rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4rem',
                  alignItems: 'center'
                }}>
                  {/* Left Content */}
                  <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.5rem 1.5rem',
                      background: 'rgba(249, 115, 22, 0.15)',
                      borderRadius: '50px',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      marginBottom: '2rem'
                    }}>
                      <span style={{
                        color: '#fb923c',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        letterSpacing: '1px'
                      }}>
                        ✨ MAKE A DIFFERENCE TODAY
                      </span>
                    </div>

                    <h1 className="hero-title" style={{
                      fontSize: '4rem',
                      fontWeight: '900',
                      lineHeight: '1.1',
                      marginBottom: '1.5rem',
                      letterSpacing: '-0.02em'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        Welcome to
                      </span>
                      <br />
                      <span style={{ color: '#e2e8f0' }}>
                        Donation App
                      </span>
                    </h1>

                    <p style={{
                      fontSize: '1.3rem',
                      color: '#cbd5e1',
                      marginBottom: '2.5rem',
                      lineHeight: '1.8',
                      fontWeight: '300'
                    }}>
                      Make a difference with your generous contributions. Together we can create positive change and build a better future for everyone.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <Link to="/signup" style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: '700',
                        padding: '1.1rem 2.5rem',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 40px rgba(249, 115, 22, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 30px rgba(249, 115, 22, 0.4)';
                      }}>
                        Get Started
                      </Link>
                      <Link to="/about" style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(10px)',
                        color: '#e2e8f0',
                        textDecoration: 'none',
                        fontWeight: '700',
                        padding: '1.1rem 2.5rem',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        fontSize: '1.1rem',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'rgba(249, 115, 22, 0.4)';
                        e.target.style.background = 'rgba(30, 41, 59, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'rgba(249, 115, 22, 0.2)';
                        e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                      }}>
                        Learn More
                      </Link>
                    </div>
                  </div>

                  {/* Right Content - Features Grid */}
                  <div className="features-grid-home" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    animation: 'fadeIn 1s ease-out 0.3s both'
                  }}>
                    {[
                      { icon: '❤️', title: 'Easy Donations', desc: 'Quick and secure donation process' },
                      { icon: '📊', title: 'Track Impact', desc: 'See how your contributions help' },
                      { icon: '🔒', title: 'Secure', desc: 'Your data and payments are protected' },
                      { icon: '🌍', title: 'Global Reach', desc: 'Support causes around the world' }
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          backdropFilter: 'blur(20px)',
                          padding: '2rem',
                          borderRadius: '20px',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
                          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.2)';
                          e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
                        }}
                      >
                        <div style={{
                          fontSize: '2.5rem',
                          marginBottom: '1rem'
                        }}>
                          {feature.icon}
                        </div>
                        <h3 style={{
                          color: '#f97316',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          marginBottom: '0.5rem'
                        }}>
                          {feature.title}
                        </h3>
                        <p style={{
                          color: '#cbd5e1',
                          fontSize: '0.95rem',
                          lineHeight: '1.6',
                          fontWeight: '300'
                        }}>
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Section */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  maxWidth: '1400px',
                  margin: '0 auto',
                  padding: '4rem 2rem',
                  animation: 'fadeIn 1s ease-out 0.6s both'
                }}>
                  <div className="stats-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '2rem'
                  }}>
                    {[
                      { number: '10K+', label: 'Active Users' },
                      { number: '$5M+', label: 'Donated' },
                      { number: '500+', label: 'Campaigns' },
                      { number: '150+', label: 'Countries' }
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        style={{
                          textAlign: 'center',
                          padding: '2rem',
                          background: 'rgba(30, 41, 59, 0.4)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          border: '1px solid rgba(249, 115, 22, 0.15)'
                        }}
                      >
                        <div style={{
                          fontSize: '3rem',
                          fontWeight: '900',
                          background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          marginBottom: '0.5rem'
                        }}>
                          {stat.number}
                        </div>
                        <div style={{
                          color: '#94a3b8',
                          fontSize: '1rem',
                          fontWeight: '600',
                          letterSpacing: '0.5px'
                        }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

