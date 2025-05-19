import React, { useState } from 'react';
import './App.css';

const API_BASE = '/server'; // Change to 'http://localhost:5000' if needed

function App() {
  const [isLogin, setIsLogin] = useState(true);
  // Login fields
  const [loginCode, setLoginCode] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // Signup fields
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  // Feedback
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('#ff9800');
  const [signupSuccess, setSignupSuccess] = useState<null | { code: string, qr: string }>(null);

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setFeedback('');
    setSignupSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    setFeedbackColor('#ff9800');
    if (!loginCode || !loginPassword) {
      setFeedback('Please enter code and password.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: loginCode, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');
      setFeedbackColor('#4caf50');
      setFeedback('Login successful!');
      localStorage.setItem('token', data.token);
      // Optionally, redirect or show dashboard
    } catch (err: any) {
      setFeedbackColor('#ff9800');
      setFeedback(err.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    setFeedbackColor('#ff9800');
    setSignupSuccess(null);
    if (!signupEmail || !signupPhone || !signupPassword) {
      setFeedback('Please fill all fields.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, phone: signupPhone, password: signupPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed.');
      setSignupSuccess({ code: data.code, qr: data.qr });
      setFeedback('');
    } catch (err: any) {
      setFeedbackColor('#ff9800');
      setFeedback(err.message);
    }
  };

  return (
    <div className="App">
      <div className="login-container">
        <h1 style={{ color: '#ff9800', letterSpacing: '0.2em', marginBottom: '0.2em', fontSize: '2.2rem' }}>FLAMES</h1>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {isLogin ? (
            <>
              <input
                type="text"
                placeholder="Code"
                value={loginCode}
                onChange={e => setLoginCode(e.target.value)}
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={signupPhone}
                onChange={e => setSignupPhone(e.target.value)}
                autoComplete="tel"
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                autoComplete="new-password"
              />
            </>
          )}
          <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>
        {feedback && <div style={{ marginTop: '1em', color: feedbackColor }}>{feedback}</div>}
        {signupSuccess && (
          <div style={{ marginTop: '1em', textAlign: 'left' }}>
            <b>Registration successful!</b><br />
            Your code: <code>{signupSuccess.code}</code><br />
            <img src={signupSuccess.qr} alt="QR Code" style={{ marginTop: '0.5em', maxWidth: '120px' }} /><br />
            <small>Save your code and QR for login.</small>
          </div>
        )}
        <p className="toggle-link" style={{ marginTop: '1.2em', fontSize: '0.98em' }}>
          <button
            type="button"
            onClick={handleToggle}
            style={{ background: 'none', border: 'none', color: '#ff9800', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', padding: 0 }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App; 