const db = require('../config/db');

// POST /api/apply
async function applyToJob(req, res) {
  try {
    const { job_id, user_id } = req.body;
    if (!job_id || !user_id) {
      return res.status(400).json({ error: 'job_id and user_id are required.' });
    }

    const [existing] = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
      [job_id, user_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "You've already applied to this job." });
    }

    await db.query('INSERT INTO applications (job_id, user_id) VALUES (?, ?)', [job_id, user_id]);
    res.status(201).json({ message: 'Application submitted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit your application.' });
  }
}

// GET /api/applications/user/:userId
async function getUserApplications(req, res) {
  try {
    const { userId } = req.params;
    const [results] = await db.query(
      `SELECT a.id AS application_id, j.id AS job_id, j.title, j.company, j.location,
              j.salary, j.job_type, a.applied_at
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = ?
       ORDER BY a.applied_at DESC`,
      [userId]
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch your applications.' });
  }
}

// GET /api/applications/job/:jobId  (applicants for an employer's job)
async function getJobApplicants(req, res) {
  try {
    const { jobId } = req.params;
    const [results] = await db.query(
      `SELECT a.id AS application_id, u.id AS user_id, u.name, u.email, a.applied_at
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.job_id = ?
       ORDER BY a.applied_at DESC`,
      [jobId]
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch applicants.' });
  }
}

module.exports = { applyToJob, getUserApplications, getJobApplicants };
