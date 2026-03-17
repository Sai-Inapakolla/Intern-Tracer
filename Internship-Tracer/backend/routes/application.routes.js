const express = require('express');
const router = express.Router();
const { uploadResume } = require('../middleware/upload');
const {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  uploadApplicationResume
} = require('../controllers/application.controller');

router.get('/',        listApplications);
router.get('/:id',    getApplication);
router.post('/',      createApplication);
router.put('/:id',    updateApplication);
router.delete('/:id', deleteApplication);
router.post('/upload', uploadResume.single('resume'), uploadApplicationResume);

module.exports = router;
