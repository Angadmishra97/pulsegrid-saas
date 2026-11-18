const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { createProject, getProjects } = require('../controllers/project.controller');

// All project routes require authentication
router.use(verifyToken);

router.post('/', createProject);
router.get('/', getProjects);

module.exports = router;