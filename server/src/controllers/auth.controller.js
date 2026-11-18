const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/tenant.model');
const User = require('../models/user.model');


// Register a new Tenant Organization & Admin User
exports.register = async (req, res) => {
  try {
    const { companyName, slug, name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // 1. Create Tenant Organization
    const tenant = new Tenant({ name: companyName, slug });
    await tenant.save();

    // 2. Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create Admin User linked to this Tenant
    const user = new User({
      name,
      email,
      password: hashedPassword,
      tenantId: tenant._id,
      role: 'Admin'
    });
    await user.save();

    res.status(201).json({
      message: 'Organization and admin user registered successfully',
      tenantId: tenant._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};