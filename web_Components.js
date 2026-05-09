import React, { useState } from 'react';
import { Colors, Spacing, BorderRadius } from '../config/theme';

// Button Component
export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style = {},
  type = 'button',
}) => {
  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
      color: Colors.text.white,
      border: 'none',
    },
    secondary: {
      background: Colors.card,
      color: Colors.text.primary,
      border: `1px solid ${Colors.border}`,
    },
    outline: {
      background: 'transparent',
      color: Colors.primary,
      border: `1.5px solid ${Colors.primary}`,
    },
    danger: {
      background: Colors.error,
      color: Colors.text.white,
      border: 'none',
    },
  };

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '15px' },
    lg: { padding: '16px 32px', fontSize: '16px' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        borderRadius: BorderRadius.md,
        fontWeight: '600',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {loading && <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, onClick = null, style = {}, pressable = false }) => {
  const baseStyle = {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    border: `0.5px solid ${Colors.border}`,
    padding: Spacing.lg,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    ...style,
  };

  if (pressable || onClick) {
    return (
      <button
        onClick={onClick}
        style={{
          ...baseStyle,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
          background: Colors.card,
        }}
      >
        {children}
      </button>
    );
  }

  return <div style={baseStyle}>{children}</div>;
};

// Input Component
export const Input = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  style = {},
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: `${Spacing.md}px ${Spacing.md}px`,
        border: `1px solid ${Colors.border}`,
        borderRadius: BorderRadius.md,
        fontSize: '14px',
        fontFamily: 'inherit',
        ...style,
      }}
    />
  );
};

// Picker Component
export const Picker = ({ items, selectedValue, onValueChange, placeholder = 'Select...' }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: `${Spacing.md}px ${Spacing.md}px`,
          border: `1px solid ${Colors.border}`,
          borderRadius: BorderRadius.md,
          backgroundColor: Colors.card,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '14px',
          color: selectedValue ? Colors.text.primary : Colors.text.tertiary,
          textAlign: 'left',
        }}
      >
        <span>
          {items?.find((i) => i.value === selectedValue)?.label || placeholder}
        </span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: Colors.card,
            border: `1px solid ${Colors.border}`,
            borderTopWidth: 0,
            borderBottomLeftRadius: BorderRadius.md,
            borderBottomRightRadius: BorderRadius.md,
            marginTop: '-1px',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {items?.map((item, index) => (
            <button
              key={item.value}
              onClick={() => {
                onValueChange(item.value);
                setExpanded(false);
              }}
              style={{
                width: '100%',
                padding: `${Spacing.md}px ${Spacing.md}px`,
                border: 'none',
                backgroundColor:
                  item.value === selectedValue ? Colors.primaryLight : 'transparent',
                color:
                  item.value === selectedValue ? Colors.primary : Colors.text.primary,
                fontWeight: item.value === selectedValue ? '600' : '400',
                cursor: 'pointer',
                textAlign: 'left',
                borderBottomWidth: index < items.length - 1 ? '1px' : '0px',
                borderBottomStyle: 'solid',
                borderBottomColor: Colors.border,
                fontSize: '14px',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Header Component
export const Header = () => {
  const user = require('../store/authStore').useAuthStore((state) => state.user);

  return (
    <header
      style={{
        backgroundColor: Colors.card,
        borderBottom: `1px solid ${Colors.border}`,
        padding: `${Spacing.md}px 20px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
          আস্সালামু আলাইকুম, {user?.displayName?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: '13px', color: Colors.text.secondary }}>
          Where are you heading today?
        </p>
      </div>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: Colors.primaryLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          color: Colors.primary,
        }}
      >
        {user?.displayName?.substring(0, 2).toUpperCase() || 'U'}
      </div>
    </header>
  );
};

export default { Button, Card, Input, Picker, Header };
