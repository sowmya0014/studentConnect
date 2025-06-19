import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const loginText = `\
To log in, enter your registered email and password.\n\nIf you don't have an account, click 'Sign up' to register.\n\nExample credentials (if you registered as Alice):\n  Email: alice@example.com\n  Password: password123\n\nYou can use any email and password you registered with.\n`;

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/forum');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <pre style={{ background: '#111', color: '#f1f1f1', padding: '10px', borderRadius: '5px', marginBottom: '1em', fontSize: '1em' }}>{loginText}</pre>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default Login; 