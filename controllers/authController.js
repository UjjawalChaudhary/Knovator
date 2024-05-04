const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/user');

// Register a new user
exports.register = (req, res) => {
  const { username, email, password } = req.body;
  // Check if user already exists
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      } else {
        const newUser = new User({
          username,
          email,
          password
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  User.findOne({ email })
    .then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'Email not found' });
      }
      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched, create JWT payload
            const payload = {
              id: user.id,
              username: user.username
            };
            // Sign token
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
          } else {
            return res.status(400).json({ message: 'Password incorrect' });
          }
        });
    });
};

