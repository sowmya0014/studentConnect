import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Forum from './pages/Forum';
import Notifications from './pages/Notifications';
import ChatGroups from './pages/ChatGroups';

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  if (!user) return null;
  return (
    <nav className="navbar">
      <span className="navbar-user">Logged in as: {user.name}</span>
      <Link to="/forum">Forum</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/groups">Chat Groups</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forum" element={<PrivateRoute><Forum /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/groups" element={<PrivateRoute><ChatGroups /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
