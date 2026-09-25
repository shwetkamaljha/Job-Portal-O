const express = require('express');
const router = express.Router();
const { getJobs, getJobsByEmployer, postJob, deleteJob } = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/employer/:employerId', getJobsByEmployer);
router.post('/', postJob);
router.delete('/:id', deleteJob);

module.exports = router;
