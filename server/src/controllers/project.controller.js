const Project = require('../models/project.model');

// Create a new Project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      tenantId: req.user.tenantId, // Injected securely from JWT middleware
      createdBy: req.user.userId
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Projects for the current Tenant
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ tenantId: req.user.tenantId });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};