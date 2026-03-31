import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Resources() {
  const [blogs, setBlogs] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/resource`);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === 'admin' ? '/resource/admin' : '/resource/user';
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${endpoint}`, newBlog, {
        headers: { token }
      });
      setIsCreating(false);
      setNewBlog({ title: '', content: '' });
      fetchBlogs();
    } catch (err) {
      console.error("Error creating blog", err);
      alert("Failed to publish blog. Please try again.");
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Community Resources & Blogs</h1>
          <p>Read the latest articles, tutorials, and updates from our instructors and students.</p>
        </div>
        
        {token && !isCreating && (
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            + Write a Blog
          </button>
        )}
      </div>

      {isCreating && (
        <div className="glass-panel mb-8" style={{ border: '2px solid var(--accent-blue)'}}>
          <h3 className="mb-4">Create a New Post</h3>
          <form onSubmit={handleCreateBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
            <input type="text" placeholder="Blog Title" required 
                   value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} 
                   style={{ fontSize: '1.2rem', padding: '1rem', width: '100%', borderRadius: '8px', border: '1px solid #e1e1e1' }} />
            <textarea placeholder="Write your content here..." required 
                   value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                   style={{ minHeight: '200px', padding: '1rem', borderRadius: '8px', border: '1px solid #e1e1e1', fontFamily: 'inherit' }} />
            
            <div className="flex gap-4" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Publish Blog</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {!token && (
        <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Log in or sign up to share your own knowledge with the community!</p>
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="glass-panel text-center">
          <h3 className="mb-2">No blogs found</h3>
          <p>Be the very first to share an article with the platform!</p>
        </div>
      ) : (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {blogs.map(blog => (
            <div key={blog._id} className="glass-panel" style={{ padding: '2rem' }}>
              <div className="flex items-center justify-between mb-2">
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{blog.title}</h2>
                <span style={{ 
                  background: blog.role === 'admin' ? 'var(--accent-orange)' : 'var(--accent-purple)', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '100px', 
                  fontSize: '0.75rem', 
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {blog.role}
                </span>
              </div>
              
              <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                Written by <span style={{ color: 'var(--text-color)', fontWeight: 700 }}>{blog.authorName}</span> • {new Date(blog.date).toLocaleDateString()}
              </div>
              
              <p style={{ lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>
                {blog.content}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
