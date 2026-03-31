import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth');
  };

  return (
    <header style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, 
      padding: '1.5rem 0', zIndex: 100,
      background: 'linear-gradient(to bottom, rgba(251, 245, 238, 0.95), rgba(251, 245, 238, 0))'
    }}>
      <div className="container flex items-center justify-between">
        <Link to="/" style={{ 
          textDecoration: 'none', 
          fontSize: '2.2rem', 
          fontWeight: 800,
          fontFamily: 'Georgia, serif',
          background: 'linear-gradient(45deg, #c7923e, #ffb13b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1.5px'
        }}>
          Learnify.
        </Link>
        
        <nav className="flex gap-4 p-2" style={{ background: 'white', borderRadius: '100px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <Link to="/" className="btn btn-nav">Courses</Link>
          <Link to="/resources" className="btn btn-nav" style={{ boxShadow: 'none' }}>Resources</Link>
          {token && <Link to="/dashboard" className="btn btn-nav" style={{ boxShadow: 'none' }}>Dashboard</Link>}
        </nav>

        <div>
          {token ? (
            <button onClick={handleLogout} className="btn btn-outline">Log Out</button>
          ) : (
            <Link to="/auth" className="btn btn-primary">Get started &rsaquo;</Link>
          )}
        </div>
      </div>
    </header>
  );
}
