import React from 'react';
import { Colors } from '../config/theme';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: Colors.card,
        borderTop: `1px solid ${Colors.border}`,
        padding: '40px 20px',
        marginTop: '60px',
        textAlign: 'center',
        color: Colors.text.secondary,
      }}
    >
      <div className="container">
        <h3 style={{ color: Colors.text.primary, marginBottom: '12px' }}>
          🚌 DhakaFare
        </h3>
        <p style={{ marginBottom: '20px', fontSize: '13px' }}>
          Authentic local transport fares shared by community
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#privacy"
            style={{
              color: Colors.primary,
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            style={{
              color: Colors.primary,
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            Terms of Service
          </a>
          <a
            href="#contact"
            style={{
              color: Colors.primary,
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            Contact Us
          </a>
        </div>
        <p style={{ fontSize: '12px', marginTop: '20px', color: Colors.text.tertiary }}>
          © 2024 DhakaFare. All rights reserved. Made with ❤️ for Dhaka
        </p>
      </div>
    </footer>
  );
};

export default Footer;
