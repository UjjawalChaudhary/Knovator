const { body } = require('express-validator');

exports.createPost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
];