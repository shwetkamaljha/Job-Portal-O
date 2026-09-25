const db = require('../config/db');

// GET /api/jobs?search=&location=
async function getJobs(req, res) {
  try {
    const { search, location } = req.query;
    let sql = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (title LIKE ? OR company LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (location) {
      sql += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }
    sql += ' ORDER BY created_at DESC';

    const [results] = await db.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch jobs.' });
  }
}

// GET /api/jobs/employer/:employerId
async function getJobsByEmployer(req, res) {
  try {
    const { employerId } = req.params;
    const [results] = await db.query(
      'SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC',
      [employerId]
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch your posted jobs.' });
  }
}

// POST /api/jobs
async function postJob(req, res) {
  try {
    const { employer_id, title, company, location, salary, job_type, description } = req.body;

    if (!employer_id || !title || !company || !location || !description) {
      return res.status(400).json({ error: 'Title, company, location and description are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO jobs (employer_id, title, company, location, salary, job_type, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [employer_id, title, company, location, salary || null, job_type || 'Full-time', description]
    );

    res.status(201).json({ message: 'Job posted successfully!', jobId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not post the job.' });
  }
}

// DELETE /api/jobs/:id
async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    res.json({ message: 'Job deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete the job.' });
  }
}

module.exports = { getJobs, getJobsByEmployer, postJob, deleteJob };
