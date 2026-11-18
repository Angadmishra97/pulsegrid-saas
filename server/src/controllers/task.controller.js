const Task = require('../models/task.model');

// Create a new Kanban Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, projectId, assignee } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      projectId,
      tenantId: req.user.tenantId,
      assignee
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Tasks by Project ID (Scoped to Tenant)
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ 
      tenantId: req.user.tenantId, 
      projectId 
    }).populate('assignee', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task Status (Kanban Drag & Drop)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, tenantId: req.user.tenantId },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized.' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};