import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/jobs').then((res) => {
      const jobs = res.data;
      const companies = new Set(jobs.map((j) => j.company)).size;
      setStats({ jobs: jobs.length, companies });
    }).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/jobs?search=${encodeURIComponent(query)}` : '/jobs');
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="hero-eyebrow">A more direct way to hire and get hired</p>
            <h1>Find work worth doing</h1>
            <p className="hero-lede">
              Bridge connects job seekers with employers directly — post a role in minutes,
              or apply to one in a couple of clicks. No noise, no middlemen.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Job title, keyword or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search jobs</button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat">
                <b>{stats.jobs}+</b>
                <span>Open roles</span>
              </div>
              <div className="hero-stat">
                <b>{stats.companies}+</b>
                <span>Companies hiring</span>
              </div>
              <div className="hero-stat">
                <b>Free</b>
                <span>To join, always</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <h3>Why people use Bridge</h3>
            <div className="hero-panel-item"><span>Post a job</span><b>~2 minutes</b></div>
            <div className="hero-panel-item"><span>Apply to a role</span><b>1 click</b></div>
            <div className="hero-panel-item"><span>Track applications</span><b>In real time</b></div>
            <div className="hero-panel-item"><span>Platform fees</span><b>₹0</b></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Two sides, one bridge</h2>
              <p>Whichever side of the table you're on, you're two steps away from a match.</p>
            </div>
          </div>

          <div className="dash-grid">
            <div className="panel">
              <h2>I'm looking for work</h2>
              <p className="sub">Search open roles by title, company, or location, and apply directly.</p>
              <button className="btn btn-primary btn-block" onClick={() => navigate(user ? '/jobs' : '/signup')}>
                Browse open roles
              </button>
            </div>
            <div className="panel">
              <h2>I'm hiring</h2>
              <p className="sub">Post a role, review it live on the search page, and track who applies.</p>
              <button
                className="btn btn-outline btn-block"
                onClick={() => navigate(user ? (user.role === 'employer' ? '/dashboard' : '/') : '/signup')}
              >
                Post a job
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer wrap">
        <span>Bridge — a job portal built with React &amp; Express.</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
