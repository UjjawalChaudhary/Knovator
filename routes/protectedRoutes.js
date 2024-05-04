const express = require('express');
const router = express.Router();
const passport = require('passport');

// Protected Route Example
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ success: true, message: 'You are authenticated!' });
});

module.exports = router;
