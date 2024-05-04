const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Get all posts
router.get('/', postController.getAllPosts);

// Get post by ID
router.get('/:postId', postController.getPostById);

// Create a new post
router.post('/', postController.createPost);

// Update post by ID
router.put('/:postId', postController.updatePost);

// Delete post by ID
router.delete('/:postId', postController.deletePost);

// Retrieve posts by latitude and longitude
router.get('/location', postController.getPostsByLocation);

// Get count of active and inactive posts
router.get('/counts', postController.getPostCounts);

module.exports = router;
