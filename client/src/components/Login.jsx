import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debug: check if localStorage has data
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token || user) {
      console.warn('Found data in localStorage:', { token, user });
    }
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { phone });
      setStep('otp');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', { phone, otp });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🎬 CinemaReview</h1>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <h2>Login with Phone Number</h2>
            <div className="form-group">
              <label>Phone Number (10 digits)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                disabled={loading}
                maxLength="10"
              />
              <small>Enter your 10-digit mobile number</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <p className="login-info">
              We'll send you a one-time password to verify your number
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <h2>Enter OTP</h2>
            <p className="otp-info">OTP sent to {phone}</p>

            <div className="form-group">
              <label>One-Time Password</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                disabled={loading}
                maxLength="6"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              className="btn-back"
              disabled={loading}
            >
              ← Back
            </button>

            <p className="otp-info">
              For testing: Use OTP 1234
            </p>
          </form>
        )}

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #333', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #555',
              color: '#aaa',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔄 Reset App
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
