import React, { useState } from 'react';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
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
      maxWidth: 550, 
      margin: '5rem auto',
      padding: '30px 40px',
      borderRadius: '15px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff'
    }}>
      <h3 style={{ 
        fontSize: '28px', 
        fontWeight: 700, 
        color: '#2c3e50',
        marginBottom: '25px',
        textAlign: 'center'
      }}>Create Your Account</h3>
      <form onSubmit={submit}>
        <input 
          name="name" 
          placeholder="Name" 
          value={form.name} 
          onChange={onChange} 
          required 
          style={{ 
            display: 'block', 
            width: '100%', 
            marginBottom: 20,
            padding: '16px 20px',
            border: '2px solid #e1e8ed',
            borderRadius: '10px',
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            background: '#fafbfc'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#27ae60';
            e.target.style.boxShadow = '0 4px 20px rgba(39, 174, 96, 0.15)';
            e.target.style.background = '#ffffff';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e1e8ed';
            e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            e.target.style.background = '#fafbfc';
            e.target.style.transform = 'translateY(0)';
          }}
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={onChange} 
          required 
          style={{ 
            display: 'block', 
            width: '100%', 
            marginBottom: 20,
            padding: '16px 20px',
            border: '2px solid #e1e8ed',
            borderRadius: '10px',
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            background: '#fafbfc'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#27ae60';
            e.target.style.boxShadow = '0 4px 20px rgba(39, 174, 96, 0.15)';
            e.target.style.background = '#ffffff';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e1e8ed';
            e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            e.target.style.background = '#fafbfc';
            e.target.style.transform = 'translateY(0)';
          }}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={onChange} 
          required 
          minLength={6} 
          style={{ 
            display: 'block', 
            width: '100%', 
            marginBottom: 25,
            padding: '16px 20px',
            border: '2px solid #e1e8ed',
            borderRadius: '10px',
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            background: '#fafbfc'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#27ae60';
            e.target.style.boxShadow = '0 4px 20px rgba(39, 174, 96, 0.15)';
            e.target.style.background = '#ffffff';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e1e8ed';
            e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            e.target.style.background = '#fafbfc';
            e.target.style.transform = 'translateY(0)';
          }}
        />
        <button 
          type="submit"
          onClick={submit}
          style={{
            padding: '18px 32px',
            background: 'linear-gradient(145deg, #8e44ad, #9b59b6)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 8px 25px rgba(155, 89, 182, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(155, 89, 182, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(155, 89, 182, 0.4)';
          }}
        >
          Create Account
        </button>
      </form>
      {error && <p style={{ 
        color: '#e74c3c', 
        textAlign: 'center', 
        marginTop: '15px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#fef5f5'
      }}>{error}</p>}
      
      <p style={{ 
        marginTop: '25px', 
        textAlign: 'center',
        color: '#7f8c8d',
        fontSize: '14px' 
      }}>
        Already have an account? <a 
          href="/login" 
          style={{ 
            color: '#8e44ad', 
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Log in
        </a>
      </p>
    </div>
  );
}