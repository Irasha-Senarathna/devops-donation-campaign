import React, { useEffect } from 'react';

export default function About() {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '4rem 2rem'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        animation: 'float 30s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 35s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(85px)',
        animation: 'pulse 20s ease-in-out infinite'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -60px) scale(1.25); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          animation: 'slideIn 0.8s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '0.75rem 2rem',
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            border: '1px solid rgba(249, 115, 22, 0.2)'
          }}>
            <span style={{ fontSize: '2rem' }}>💝</span>
            <span style={{
              color: '#f97316',
              fontSize: '0.9rem',
              fontWeight: '700',
              letterSpacing: '1px'
            }}>
              ABOUT US
            </span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            About Our Donation Platform
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#cbd5e1',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontWeight: '300'
          }}>
            We built this platform to empower individuals and organizations to create meaningful impact.
            Transparency, speed, and compassion are at the heart of everything we do.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: '3rem',
          animation: 'fadeInUp 1s ease-out 0.2s both'
        }}>
          {[
            {
              icon: '🎯',
              title: 'Mission',
              text: 'Connect donors with verified causes, ensuring every contribution reaches those who need it most.',
              color: '#f97316'
            },
            {
              icon: '🔒',
              title: 'Security',
              text: 'We employ modern security practices, encrypted tokens, and role-based access to safeguard data.',
              color: '#fb923c'
            },
            {
              icon: '📊',
              title: 'Impact Tracking',
              text: 'Realtime dashboards and analytics (coming soon) show exactly where funds are allocated.',
              color: '#fdba74'
            },
            {
              icon: '🤝',
              title: 'Community',
              text: 'Open collaboration with volunteers, NGOs, and developers fosters continuous improvement.',
              color: '#f97316'
            },
          ].map((card, idx) => (
            <div
              key={card.title}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(249, 115, 22, 0.2)',
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
                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.2)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${card.color} 0%, transparent 100%)`
              }} />

              <div style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${card.color}30 0%, ${card.color}10 100%)`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1.25rem',
                border: `1px solid ${card.color}40`
              }}>
                {card.icon}
              </div>

              <h3 style={{
                margin: '0 0 0.75rem',
                fontSize: '1.4rem',
                fontWeight: '700',
                color: card.color,
                letterSpacing: '-0.01em'
              }}>
                {card.title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: '1rem',
                color: '#cbd5e1',
                lineHeight: '1.7',
                fontWeight: '300'
              }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* Our Promise Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          padding: '3rem',
          borderRadius: '24px',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          boxShadow: '0 20px 60px rgba(249, 115, 22, 0.2)',
          animation: 'fadeInUp 1s ease-out 0.4s both',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              margin: '0 0 1.5rem',
              fontSize: '2.2rem',
              fontWeight: '800',
              color: '#f97316',
              letterSpacing: '-0.01em'
            }}>
              Our Promise
            </h2>
            <p style={{
              margin: '0 0 2rem',
              fontSize: '1.15rem',
              color: '#e2e8f0',
              maxWidth: '750px',
              lineHeight: '1.8',
              fontWeight: '300'
            }}>
              We continuously refine our technology stack to deliver a fast, accessible, and trustworthy
              experience. Your feedback guides the journey.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {[
                'Open Source Friendly',
                'Scalable Architecture',
                'User-Centric Design',
                'Data Transparency'
              ].map((badge, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(249, 115, 22, 0.2)',
                    color: '#fdba74',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(249, 115, 22, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(249, 115, 22, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '2.5rem',
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(249, 115, 22, 0.15)',
          animation: 'fadeInUp 1s ease-out 0.6s both'
        }}>
          <p style={{
            margin: '0 0 1.5rem',
            fontSize: '1.1rem',
            color: '#cbd5e1',
            lineHeight: '1.8',
            fontWeight: '300'
          }}>
            Interested in collaborating or integrating with our platform? Reach out and help us build
            tools that drive real-world change.
          </p>
          <button
            style={{
              padding: '1rem 2.5rem',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
              letterSpacing: '0.5px'
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
            Get In Touch
          </button>
        </div>

        {/* Footer Stats */}
        <div style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          animation: 'fadeInUp 1s ease-out 0.8s both'
        }}>
          {[
            { number: '1000+', label: 'Active Campaigns' },
            { number: '5000+', label: 'Happy Donors' },
            { number: '$2M+', label: 'Funds Raised' },
            { number: '99.9%', label: 'Uptime' }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: 'rgba(30, 41, 59, 0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(249, 115, 22, 0.15)'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                {stat.number}
              </div>
              <div style={{
                color: '#94a3b8',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}