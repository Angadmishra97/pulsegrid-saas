const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Backlog', 'InProgress', 'Review', 'Done'], default: 'Backlog' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Optimize query performance for multi-tenant kanban boards
taskSchema.index({ tenantId: 1, projectId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);