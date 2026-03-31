import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="container" style={{ paddingTop: '6rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
