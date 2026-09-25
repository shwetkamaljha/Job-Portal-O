import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      const res = await api.get('/jobs', { params });
      setJobs(res.data);
    } catch {
      showToast('Could not load jobs. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, location, showToast]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (user?.role === 'seeker') {
      api.get(`/applications/user/${user.id}`)
        .then((res) => setAppliedIds(new Set(res.data.map((a) => a.job_id))))
        .catch(() => {});
    }
  }, [user]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
    fetchJobs();
  }

  async function handleApply(jobId) {
    if (!user) {
      showToast('Log in as a job seeker to apply.', 'error');
      return;
    }
    if (user.role !== 'seeker') {
      showToast('Only job seekers can apply to roles.', 'error');
      return;
    }
    setApplyingId(jobId);
    try {
      await api.post('/applications', { job_id: jobId, user_id: user.id });
      setAppliedIds((prev) => new Set(prev).add(jobId));
      showToast('Application submitted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not submit your application.', 'error');
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="page">
      <div className="wrap section">
        <div className="section-head">
          <div>
            <h2>Browse open roles</h2>
            <p>{loading ? 'Loading…' : `${jobs.length} role${jobs.length === 1 ? '' : 's'} match your search`}</p>
          </div>
        </div>

        <form className="filters" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Title or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={fetchJobs}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {loading ? (
          <div className="spinner" />
        ) : jobs.length === 0 ? (
          <div className="empty">
            <h3>No roles found</h3>
            <p>Try a different keyword or clear your filters.</p>
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applied={appliedIds.has(job.id)}
                applying={applyingId === job.id}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
