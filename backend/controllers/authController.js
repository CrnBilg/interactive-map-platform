const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../config/jwt');

const generateToken = (id) =>
  jwt.sign({ id }, getJwtSecret(), { expiresIn: '30d' });

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    if (username.length < 3)
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists?.email === email) return res.status(400).json({ message: 'Email already registered' });
    if (exists?.username === username) return res.status(400).json({ message: 'Username already taken' });

    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('savedPlaces');
  res.json(user);
};

// @PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      bio: updated.bio,
      avatar: updated.avatar,
      token: generateToken(updated._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/save-place/:placeId
const savePlace = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const placeId = req.params.placeId;
    const idx = user.savedPlaces.indexOf(placeId);
    if (idx > -1) {
      user.savedPlaces.splice(idx, 1);
    } else {
      user.savedPlaces.push(placeId);
    }
    await user.save();
    res.json({ savedPlaces: user.savedPlaces });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile, savePlace };
