import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/course/preview`);
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <section style={{ padding: '4rem 0 6rem 0' }}>
        <p style={{ color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '1rem' }}>
          Introducing a new learning platform
        </p>
        <h1 style={{ maxWidth: '800px' }}>
          Build beautiful skills, faster.
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '3rem' }}>
          A professional premium library of modern web courses for developers and designers.
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); setActiveSearch(searchTerm); }} style={{ display: 'flex', gap: '1rem', maxWidth: '500px' }}>
          <input 
            type="text" 
            placeholder="Find courses" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2.5rem' }}>Search</button>
        </form>
      </section>

      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', paddingBottom: '4rem' }}>
        {courses
          .filter(course => !activeSearch || 
             course.title.toLowerCase().includes(activeSearch.toLowerCase()) || 
             course.description.toLowerCase().includes(activeSearch.toLowerCase())
          )
          .map(course => (
             <CourseCard key={course._id} course={course} />
          ))
        }
        
        {courses.filter(course => !activeSearch || course.title.toLowerCase().includes(activeSearch.toLowerCase()) || course.description.toLowerCase().includes(activeSearch.toLowerCase())).length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)' }}>
            <h3>No courses match "{activeSearch}"</h3>
            <p>Try searching for a different framework or topic like "React" or "Design".</p>
            <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setSearchTerm(''); setActiveSearch(''); }}>Clear Search</button>
          </div>
        )}
      </section>

      <section className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', paddingBottom: '4rem' }}>
        <div className="info-card bg-purple">
          <h3 style={{color: 'white'}}>Expert Software Architects</h3>
          <p>Learn directly from industry veterans who have built scalable systems at top tech companies.</p>
        </div>
        <div className="info-card bg-green">
          <h3 style={{color: 'white'}}>Hands-on Projects</h3>
          <p>Every course features real-world project builds, ensuring you graduate with an interview-ready portfolio.</p>
        </div>
        <div className="info-card bg-blue">
          <h3 style={{color: 'white'}}>Lifetime Platform Access</h3>
          <p>Once you enroll, the material is yours forever. Stay updated as frameworks and languages evolve over time.</p>
        </div>
      </section>
    </div>
  );
}
