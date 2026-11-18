const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { createTask, getTasksByProject, updateTaskStatus } = require('../controllers/task.controller');

// All task routes require authentication
router.use(verifyToken);

router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.patch('/:taskId/status', updateTaskStatus);

module.exports = router;