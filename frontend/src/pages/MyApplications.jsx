import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MyApplications() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/user/${user.id}`)
      .then((res) => setApplications(res.data))
      .catch(() => showToast('Could not load your applications.', 'error'))
      .finally(() => setLoading(false));
  }, [user.id, showToast]);

  return (
    <div className="page">
      <div className="wrap section">
        <div className="section-head">
          <div>
            <h2>My applications</h2>
            <p>{loading ? 'Loading…' : `You've applied to ${applications.length} role${applications.length === 1 ? '' : 's'}`}</p>
          </div>
          <Link to="/jobs" className="btn btn-outline">Browse more jobs</Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : applications.length === 0 ? (
          <div className="empty">
            <h3>You haven't applied to anything yet</h3>
            <p>Once you apply to a role, it'll show up here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Applied on</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.application_id}>
                    <td>{a.title}</td>
                    <td>{a.company}</td>
                    <td>{a.location}</td>
                    <td>{a.salary || '—'}</td>
                    <td>{new Date(a.applied_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
