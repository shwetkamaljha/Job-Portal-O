const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getUserApplications,
  getJobApplicants,
} = require('../controllers/applicationController');

router.post('/', applyToJob);
router.get('/user/:userId', getUserApplications);
router.get('/job/:jobId', getJobApplicants);

module.exports = router;
