import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Button, Input } from '../components/UI';
import { Colors } from '../config/theme';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(email, password, fullName);

    if (result.success) {
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Registration failed');
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
        padding: '40px 20px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <Link
          to="/login"
          style={{
            fontSize: 24,
            color: Colors.text.white,
            textDecoration: 'none',
            marginBottom: 12,
            display: 'inline-block',
          }}
        >
          ←
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: '700', color: Colors.text.white, marginBottom: 4 }}>
          Create Account
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
          Join the community and share local fares
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
        {/* Full Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 8 }}>
            Full name
          </label>
          <Input
            placeholder="Md. Rafiqul Alam"
            value={fullName}
            onChange={setFullName}
          />
        </div>

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
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 8 }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
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

        {/* Confirm Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, display: 'block', marginBottom: 8 }}>
            Confirm password
          </label>
          <div style={{ position: 'relative' }}>
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
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
              {showConfirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <Button
          onClick={handleRegister}
          loading={loading}
          disabled={loading}
          style={{ width: '100%', marginBottom: 16 }}
        >
          Create Account
        </Button>

        {/* Login Link */}
        <p style={{ textAlign: 'center', fontSize: 13, color: Colors.text.secondary }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: Colors.primary, fontWeight: '600' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
