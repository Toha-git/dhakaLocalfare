import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../config/theme';

const Navigation = () => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { path: '/', label: '🏠 Home', icon: '🏠' },
    { path: '/add-fare', label: '➕ Add Fare', icon: '➕' },
    { path: '/community', label: '👥 Community', icon: '👥' },
    { path: '/profile', label: '👤 Profile', icon: '👤' },
  ];

  return (
    <nav
      style={{
        background: Colors.card,
        borderBottom: `1px solid ${Colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="container"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '60px',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: Colors.primaryDark,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '180px',
          }}
        >
          🚌 DhakaFare
        </Link>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === item.path ? Colors.primary : Colors.text.secondary,
                fontWeight: location.pathname === item.path ? '600' : '500',
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                background:
                  location.pathname === item.path ? Colors.primaryLight : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            to="/settings"
            style={{
              fontSize: '18px',
              textDecoration: 'none',
              color: Colors.text.secondary,
            }}
          >
            ⚙️
          </Link>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              background: Colors.error,
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.background = '#dc2626')}
            onMouseOut={(e) => (e.target.style.background = Colors.error)}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <style>{`
        @media (max-width: 768px) {
          nav > div {
            flex-wrap: wrap !important;
            gap: 0 !important;
          }

          nav > div > a:first-child {
            width: 100%;
            margin-bottom: 12px;
          }

          nav > div > div:nth-child(2) {
            order: 3;
            width: 100%;
            justify-content: flex-start !important;
            flex-wrap: wrap;
          }

          nav > div > div:last-child {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
