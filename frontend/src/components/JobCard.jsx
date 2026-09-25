function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

export default function JobCard({ job, applied, onApply, applying }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <span className="badge">{job.job_type || 'Full-time'}</span>
      </div>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span>🕓 {timeAgo(job.created_at)}</span>
      </div>

      <p className="job-desc">{job.description}</p>

      <div className="job-card-foot">
        <span className="salary">{job.salary ? job.salary : 'Salary not disclosed'}</span>
        {applied ? (
          <span className="badge badge-applied">✓ Applied</span>
        ) : (
          <button className="btn btn-accent btn-sm" onClick={() => onApply(job.id)} disabled={applying}>
            {applying ? 'Applying…' : 'Apply now'}
          </button>
        )}
      </div>
    </article>
  );
}
