// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Helper to sign a 15‑minute token
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '55m',
  });

/**
 * @route POST /api/auth/signup
 */
// router.post('/signup', async (req, res) => {
//   try {
//     const name     = req.body.user;
//     const { email, password } = req.body;
//     if (!name || !email || !password)
//       return res.status(400).json({ message: 'Please fill all fields' });

//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'Email already in use' });

//     const hash = await bcrypt.hash(password, 10);
//     user = await User.create({ name, email, password: hash });

//     const token = signToken(user._id);
//     res.status(201).json({
//       user: { id: user._id, name: user.name, email: user.email },
//       token
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body; // Include adminKey in the request body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    console.log("Admin Key:", adminKey); // Log the adminKey for debugging
    // Check if the provided adminKey matches the environment variable
    const isadmin = adminKey === process.env.ADMIN_KEY;

    user = await User.create({
      name,
      email,
      password: hash,
      isadmin, // Set isAdmin based on the adminKey validation
    });

    const token = signToken(user._id);
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/auth/me
 */
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

/**
 * @route POST /api/auth/logout
 */
router.post('/logout', authMiddleware, (req, res) => {
  // Client should simply drop the token on logout
  res.json({ message: 'Logged out' });
});

module.exports = router;
