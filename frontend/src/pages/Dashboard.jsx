import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  
  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '', imageUrl: '' });
  
  // Editing state
  const [editingCourse, setEditingCourse] = useState(null);

  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const fetchDashboardData = async () => {
    try {
      if (role === 'admin') {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/course/bulk`, {}, {
          headers: { token }
        });
        setCourses(res.data.courses || []);
      } else {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/purchases`, { headers: { token } });
        const allCourses = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/course/preview`);
        const purchaseRecords = res.data.purchases || [];
        const purchasedIds = purchaseRecords.map(p => p.courseId);
        const myCourses = allCourses.data.courses.filter(c => purchasedIds.includes(c._id));
        setCourses(myCourses);
      }
    } catch (err) {
      console.error("Dashboard error", err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchDashboardData();
  }, [token, role, navigate]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/course`, newCourse, {
        headers: { token }
      });
      setIsCreating(false);
      setNewCourse({ title: '', description: '', price: '', imageUrl: '' });
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating course", err);
      alert("Failed to create course");
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/course`, {
        courseId: editingCourse._id,
        title: editingCourse.title,
        description: editingCourse.description,
        price: editingCourse.price,
        imageUrl: editingCourse.imageUrl
      }, {
        headers: { token }
      });
      setEditingCourse(null);
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating course", err);
      alert("Failed to update course");
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>{role === 'admin' ? 'My Created Courses' : 'My Learning'}</h1>
          <p>
            {role === 'admin' 
              ? 'Welcome back! Here are the courses you have built.' 
              : 'Dive back into your purchased courses and keep growing.'}
          </p>
        </div>
        
        {role === 'admin' && !isCreating && !editingCourse && (
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            + Create New Course
          </button>
        )}
      </div>

      {isCreating && (
        <div className="glass-panel mb-8" style={{ border: '2px solid var(--accent-blue)'}}>
          <h3 className="mb-4">Create a New Course</h3>
          <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <input type="text" placeholder="Course Title" required 
                   value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
            <input type="text" placeholder="Short Description" required 
                   value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
            <input type="number" placeholder="Price (e.g. ₹999)" required min="0"
                   value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} />
            <input type="url" placeholder="Course Thumbnail Image URL (optional)" 
                   value={newCourse.imageUrl} onChange={e => setNewCourse({...newCourse, imageUrl: e.target.value})} />
            
            <div className="flex gap-4" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Publish Course</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {editingCourse && (
        <div className="glass-panel mb-8" style={{ border: '2px solid var(--accent-orange)'}}>
          <h3 className="mb-4">Edit Course: {editingCourse.title}</h3>
          <form onSubmit={handleUpdateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <input type="text" placeholder="Course Title" required 
                   value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} />
            <input type="text" placeholder="Short Description" required 
                   value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} />
            <input type="number" placeholder="Price (e.g. ₹999)" required min="0"
                   value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: e.target.value})} />
            <input type="url" placeholder="Course Thumbnail Image URL (optional)" 
                   value={editingCourse.imageUrl} onChange={e => setEditingCourse({...editingCourse, imageUrl: e.target.value})} />
            
            <div className="flex gap-4" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-outline" onClick={() => setEditingCourse(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {courses.length === 0 && !isCreating && !editingCourse ? (
        <div className="glass-panel text-center">
          <h3 className="mb-2">No courses found</h3>
          <p>
            {role === 'admin' 
              ? 'You have not created any courses yet. Click the button above to start teaching!' 
              : 'You have not enrolled in any courses yet. Go to the home page to explore!'}
          </p>
        </div>
      ) : (
        <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {courses.map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              isPurchased={role !== 'admin'} 
              onEdit={role === 'admin' ? () => setEditingCourse(course) : null}
            />
          ))}
        </section>
      )}
    </div>
  );
}
