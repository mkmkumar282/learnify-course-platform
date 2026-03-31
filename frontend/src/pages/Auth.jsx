import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: ''
  });
  
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const roleString = isAdmin ? 'admin' : 'user';
    const actionString = isLogin ? 'signin' : 'signup';
    
    try {
      const res = await axios.post(`http://localhost:3000/${roleString}/${actionString}`, formData);
      
      if (res.data.token || res.data.message) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', roleString);
          navigate('/dashboard');
        } else {
          // If signup was successful but no token (just msg), auto flip to login!
          setIsLogin(true);
          setError('Signup successful! Please log in.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="flex" style={{ height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-2">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
        <p className="text-center mb-8">
          Sign in to access your beautiful premium courses.
        </p>

        {error && (
          <div className="mb-4" style={{ padding: '0.8rem', background: 'rgba(255,0,0,0.1)', color: 'red', borderRadius: '8px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="flex gap-4 mb-2">
             <button type="button" className={`btn ${isAdmin ? 'btn-outline' : 'btn-primary'}`} style={{flex: 1}} onClick={() => setIsAdmin(false)}>Student</button>
             <button type="button" className={`btn ${!isAdmin ? 'btn-outline' : 'btn-primary'}`} style={{flex: 1}} onClick={() => setIsAdmin(true)}>Instructor</button>
          </div>

          {!isLogin && (
            <div className="flex gap-4">
              <input type="text" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          )}

          <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength={6} />

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '2rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}
