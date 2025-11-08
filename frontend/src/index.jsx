import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import homeBg from './assests/2.jpg';

// Modern CSS styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  body {
    background-color: #f8fafc;
    color: #334155;
    line-height: 1.6;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .app-nav {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    padding: 1rem 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  .logout-btn {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;
  }
  
  .logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  
  .welcome-container {
    background: white;
    border-radius: 0.75rem;
    padding: 2.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    text-align: center;
    max-width: 600px;
    width: 100%;
    margin-top: 2rem;
  }
  
  .welcome-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .welcome-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    margin-bottom: 2rem;
  }

  .welcome-image {
    width: 100%;
    max-width: 500px;
    border-radius: 0.75rem;
    margin-top: 1.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .feature-card {
    background: #f1f5f9;
    padding: 1.5rem;
    border-radius: 0.5rem;
    text-align: center;
    transition: transform 0.2s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-3px);
  }
  
  .feature-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #6366f1;
  }
  
  @media (max-width: 768px) {
    .app-nav {
      padding: 1rem;
      flex-wrap: wrap;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .welcome-container {
      padding: 1.5rem;
    }
  }
`;

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <>
      <style>{styles}</style>
      <BrowserRouter>
        <nav className="app-nav">
          <Link to="/" className="nav-link">Home</Link>
          {!token && <Link to="/signup" className="nav-link">Signup</Link>}
          {!token && <Link to="/login" className="nav-link">Login</Link>}
          <Link to="/about" className="nav-link">About</Link>
          {token && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
          {token && (
            <button 
              className="logout-btn" 
              onClick={() => { 
                localStorage.removeItem('token'); 
                window.location = '/'; 
              }}
            >
              Logout
            </button>
          )}
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <div style={{
                  width: '100%',
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  background: `linear-gradient(rgba(1,1,1,0), rgba(1,1,1,0)), url(${homeBg}) center / cover no-repeat fixed`
                }}>
                  <div className="welcome-container" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', marginTop: 0 }}>
                    <h1 className="welcome-title">Welcome to Donation App</h1>
                    <p className="welcome-subtitle">
                      Make a difference with your generous contributions. Together we can create positive change.
                    </p>

                    <div className="features-grid">
                      <div className="feature-card">
                        <div className="feature-icon">❤️</div>
                        <h3>Easy Donations</h3>
                        <p>Quick and secure donation process</p>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Impact</h3>
                        <p>See how your contributions help</p>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure</h3>
                        <p>Your data and payments are protected</p>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon">🌍</div>
                        <h3>Global Reach</h3>
                        <p>Support causes around the world</p>
                      </div>
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
        </main>
      </BrowserRouter>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
