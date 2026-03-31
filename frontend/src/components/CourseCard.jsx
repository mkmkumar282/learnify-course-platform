import { useState } from 'react';
import axios from 'axios';

export default function CourseCard({ course, isPurchased = false, onEdit }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setMessage('Please login first!');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/course/purchase`, {
        courseId: course._id
      }, {
        headers: { token }
      });
      setMessage('✅ ' + res.data.message);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Error purchasing'));
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', transition: 'transform 0.2s ease' }}
         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      
      <div style={{
        height: '180px', 
        borderRadius: '12px', 
        background: `linear-gradient(135deg, var(--accent-orange), var(--accent-blue))`,
        backgroundImage: course.imageUrl ? `url(${course.imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '0.5rem'
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.25rem' }}>{course.title || 'Amazing Course'}</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem', minHeight: '3rem' }}>
          {course.description || 'Learn to build beautiful and robust systems rapidly.'}
        </p>
        
        {course.creatorId && (
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 600, marginTop: 'auto' }}>
            Instructor: {course.creatorId.firstName} {course.creatorId.lastName}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
        <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>
          ₹{course.price || '99'}
        </span>
        
        {!isPurchased && !onEdit && (
          <button 
            className="btn btn-primary" 
            onClick={handlePurchase} 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Enroll Now'}
          </button>
        )}

        {onEdit && (
          <button 
            className="btn btn-outline" 
            onClick={onEdit} 
          >
            Edit Course
          </button>
        )}
      </div>

      {message && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.8rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          background: message.includes('✅') ? 'rgba(73, 192, 118, 0.1)' : 'rgba(255, 0, 0, 0.1)',
          color: message.includes('✅') ? 'var(--accent-green)' : 'red'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
