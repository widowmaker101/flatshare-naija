require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  city: String
});
const User = mongoose.model('User', userSchema);

const roomSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  city: String,
  state: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
const Room = mongoose.model('Room', roomSchema);

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, city } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, phone, city });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name, email, city } });
  } catch (err) {
    res.status(400).json({ msg: 'User already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email, city: user.city } });
  } catch (err) {
    res.status(400).json({ msg: 'Server error' });
  }
});

app.get('/api/rooms', async (req, res) => {
  const { city, min, max } = req.query;
  let filter = {};
  if (city) filter.city = new RegExp(city, 'i');
  if (min || max) filter.price = { ...(min && { $gte: +min }), ...(max && { $lte: +max }) };
  const rooms = await Room.find(filter).populate('owner', 'name phone');
  res.json(rooms);
});

app.post('/api/rooms', auth, async (req, res) => {
  const room = new Room({ ...req.body, owner: req.user });
  await room.save();
  const populatedRoom = await Room.findById(room._id).populate('owner', 'name phone');
  res.json(populatedRoom);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
