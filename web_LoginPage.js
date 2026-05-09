import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Button, Input } from '../components/UI';
import { Colors } from '../config/theme';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, ${Colors.primaryDark} 0%, ${Colors.primary} 60%, #5DCAA5 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 20px',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 42,
            margin: '0 auto 12px',
          }}
        >
          🚌
        </div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 }}>
          DhakaFare
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
          স্থানীয় ভাড়ার সঠিক তথ্য · Authentic local fares
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: Colors.card,
          borderRadius: 20,
          padding: '40px 24px',
          maxWidth: '400px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: '600', marginBottom: 4 }}>Welcome back</h2>
        <p style={{ color: Colors.text.secondary, fontSize: 13, marginBottom: 24 }}>
          Sign in to check local fares across Dhaka
        </p>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 8 }}>
            Email address
          </label>
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={setEmail}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 8 }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <Link
          to="#"
          style={{
            color: Colors.primary,
            fontWeight: '600',
            fontSize: 13,
            display: 'inline-block',
            marginBottom: 20,
          }}
        >
          Forgot password?
        </Link>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          loading={loading}
          disabled={loading}
          style={{ width: '100%', marginBottom: 16 }}
        >
          Sign in
        </Button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: 12 }}>
          <div style={{ flex: 1, height: 0.5, background: Colors.border }} />
          <span style={{ color: Colors.text.tertiary, fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 0.5, background: Colors.border }} />
        </div>

        {/* Sign Up Link */}
        <p style={{ textAlign: 'center', fontSize: 13, color: Colors.text.secondary }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: Colors.primary, fontWeight: '600' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
