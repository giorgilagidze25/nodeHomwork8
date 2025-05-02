const { Router } = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isAuth = require("../midelwear/isAuth.midelwear");
const { directorSchema } = require("../validetion/director.validetion");
const directorModel = require("../models/director.model");

require('dotenv').config();

const authRouter = Router();

authRouter.post('/sign-up', async (req, res) => {
  const { error } = directorSchema.validate(req.body || {});
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { fullName, email, password } = req.body;

  try {
    const existUser = await directorModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await directorModel.create({
      fullName,
      email,
      password: hashedPass,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

authRouter.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existUser = await directorModel.findOne({ email }).select('password');

    if (!existUser) {
      return res.status(400).json({ message: 'Email or password is invalid' });
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) {
      return res.status(400).json({ message: 'Email or password is invalid' });
    }

    const payload = {
      userId: existUser._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

authRouter.get('/current-user', isAuth, async (req, res) => {
  try {
    const user = await directorModel.findById(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = authRouter;
