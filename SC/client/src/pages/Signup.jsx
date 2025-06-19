import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { signup, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: '', year: '', tags: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    const res = await signup(data);
    if (res.success) {
      navigate('/forum');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} required />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup; 