import React, { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    const prev = {
      background: document.body.style.background,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundAttachment: document.body.style.backgroundAttachment,
    };

    // Apply dark overlay (85%) with local image
    document.body.style.background = `
      linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
      url('/src/assests/banner.jpg') center / cover no-repeat fixed
    `;
    document.body.style.backgroundAttachment = 'fixed';

    // Cleanup when component unmounts
    return () => {
      document.body.style.background = prev.background || '#f8fafc';
      document.body.style.backgroundSize = prev.backgroundSize || '';
      document.body.style.backgroundPosition = prev.backgroundPosition || '';
      document.body.style.backgroundAttachment = prev.backgroundAttachment || '';
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: 950,
        margin: '2.5rem auto',
        padding: '2.75rem 2.5rem',
        background: 'rgba(255,255,255,0.90)',
        borderRadius: '30px',
        boxShadow: '0 30px 90px -15px rgba(0,0,0,0.55)',
        lineHeight: 1.65,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.4)',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        About Our Donation Platform
      </h1>

      <p style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '1.5rem' }}>
        We built this platform to empower individuals and organizations to create meaningful impact.
        Transparency, speed, and compassion are at the heart of everything we do.
      </p>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          marginBottom: '2rem',
        }}
      >
        {[
          {
            title: 'Mission',
            text: 'Connect donors with verified causes, ensuring every contribution reaches those who need it most.',
          },
          {
            title: 'Security',
            text: 'We employ modern security practices, encrypted tokens, and role-based access to safeguard data.',
          },
          {
            title: 'Impact Tracking',
            text: 'Realtime dashboards and analytics (coming soon) show exactly where funds are allocated.',
          },
          {
            title: 'Community',
            text: 'Open collaboration with volunteers, NGOs, and developers fosters continuous improvement.',
          },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: '#f1f5f9',
              padding: '1.25rem 1.25rem 1.5rem',
              borderRadius: '18px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3
              style={{
                margin: '0 0 .5rem',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              {card.title}
            </h3>
            <p style={{ margin: 0, fontSize: '.95rem', color: '#475569' }}>{card.text}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
          color: '#fff',
          padding: '1.75rem 2rem',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 10px 40px -5px rgba(79,70,229,0.5)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700 }}>Our Promise</h2>
        <p style={{ margin: 0, fontSize: '1rem', maxWidth: 650 }}>
          We continuously refine our technology stack to deliver a fast, accessible, and trustworthy
          experience. Your feedback guides the journey.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span
            style={{
              background: '#fff',
              color: '#4f46e5',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: '.75rem',
              fontWeight: 600,
            }}
          >
            Open Source Friendly
          </span>
          <span
            style={{
              background: '#fff',
              color: '#4f46e5',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: '.75rem',
              fontWeight: 600,
            }}
          >
            Scalable Architecture
          </span>
          <span
            style={{
              background: '#fff',
              color: '#4f46e5',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: '.75rem',
              fontWeight: 600,
            }}
          >
            User-Centric Design
          </span>
          <span
            style={{
              background: '#fff',
              color: '#4f46e5',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: '.75rem',
              fontWeight: 600,
            }}
          >
            Data Transparency
          </span>
        </div>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '.9rem', color: '#64748b' }}>
        Interested in collaborating or integrating with our platform? Reach out and help us build
        tools that drive real-world change.
      </p>
    </div>
  );
}