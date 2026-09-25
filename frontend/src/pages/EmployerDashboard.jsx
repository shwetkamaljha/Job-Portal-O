import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const emptyForm = { title: '', company: '', location: '', salary: '', job_type: 'Full-time', description: '' };

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/employer/${user.id}`);
      setJobs(res.data);
    } catch {
      showToast('Could not load your job postings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user.id, showToast]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post('/jobs', { ...form, employer_id: user.id });
      showToast('Job posted successfully!', 'success');
      setForm(emptyForm);
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not post the job.', 'error');
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(jobId) {
    if (!confirm('Remove this job posting? This cannot be undone.')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      showToast('Job removed.', 'success');
    } catch {
      showToast('Could not remove the job.', 'error');
    }
  }

  async function toggleApplicants(jobId) {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    setExpandedJobId(jobId);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
    } catch {
      showToast('Could not load applicants.', 'error');
    }
  }

  return (
    <div className="page">
      <div className="wrap section">
        <div className="section-head">
          <div>
            <h2>Employer dashboard</h2>
            <p>Post a role and keep an eye on who's applying.</p>
          </div>
        </div>

        <div className="dash-grid">
          <div className="panel">
            <h2>Post a new job</h2>
            <p className="sub">It'll appear on the search page immediately.</p>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="title">Job title</label>
                <input id="title" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer" />
              </div>
              <div className="field">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" required value={form.company} onChange={handleChange} placeholder="e.g. Acme Inc." />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="location">Location</label>
                  <input id="location" name="location" required value={form.location} onChange={handleChange} placeholder="e.g. Pune, India" />
                </div>
                <div className="field">
                  <label htmlFor="salary">Salary (optional)</label>
                  <input id="salary" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹8–12 LPA" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="job_type">Job type</label>
                <select id="job_type" name="job_type" value={form.job_type} onChange={handleChange}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Remote</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" required value={form.description} onChange={handleChange} placeholder="Responsibilities, requirements, benefits…" />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={posting}>
                {posting ? 'Posting…' : 'Post job'}
              </button>
            </form>
          </div>

          <div>
            <h2 style={{ marginBottom: 4 }}>Your postings</h2>
            <p className="sub" style={{ marginBottom: 20 }}>{jobs.length} job{jobs.length === 1 ? '' : 's'} live</p>

            {loading ? (
              <div className="spinner" />
            ) : jobs.length === 0 ? (
              <div className="empty">
                <h3>No jobs posted yet</h3>
                <p>Use the form to post your first opening.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id}>
                  <div className="list-card">
                    <div>
                      <p className="list-card-title">{job.title}</p>
                      <p className="list-card-sub">{job.location} · {job.job_type}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => toggleApplicants(job.id)}>
                        {expandedJobId === job.id ? 'Hide' : 'Applicants'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Delete</button>
                    </div>
                  </div>

                  {expandedJobId === job.id && (
                    <div className="table-wrap" style={{ marginBottom: 16 }}>
                      {applicants.length === 0 ? (
                        <p style={{ padding: 18 }}>No applicants yet.</p>
                      ) : (
                        <table>
                          <thead>
                            <tr><th>Name</th><th>Email</th><th>Applied</th></tr>
                          </thead>
                          <tbody>
                            {applicants.map((a) => (
                              <tr key={a.application_id}>
                                <td>{a.name}</td>
                                <td>{a.email}</td>
                                <td>{new Date(a.applied_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
