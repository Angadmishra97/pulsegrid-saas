const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  role: { type: String, enum: ['Admin', 'ProjectManager', 'Member'], default: 'Member' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);