const { validationResult } = require('express-validator');
const Post = require('../models/post');

// Get all posts
exports.getAllPosts = (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Get post by ID
exports.getPostById = (req, res) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Create a new post
exports.createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, body, latitude, longitude } = req.body;
  const newPost = new Post({
    title,
    body,
    createdBy: req.user._id,
    latitude,
    longitude
  });
  newPost.save()
    .then(post => res.status(201).json(post))
    .catch(err => res.status(400).json({ error: err.message }));
};

// Update post by ID
exports.updatePost = (req, res) => {
  Post.findOneAndUpdate({ _id: req.params.postId, createdBy: req.user._id }, req.body, { new: true })
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Delete post by ID
exports.deletePost = (req, res) => {
  Post.findOneAndDelete({ _id: req.params.postId, createdBy: req.user._id })
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Retrieve posts by latitude and longitude
exports.getPostsByLocation = (req, res) => {
  const { latitude, longitude, radius } = req.query;

  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  // Convert radius to meters
  const rad = parseInt(radius) || 10000; // default radius: 10 kilometers

  // Query posts within the specified radius
  Post.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lon, lat] // longitude first, then latitude
        },
        $maxDistance: rad
      }
    }
  })
  .then(posts => res.json(posts))
  .catch(err => res.status(500).json({ error: err.message }));
};

// Get count of active and inactive posts
exports.getPostCounts = (req, res) => {
  Post.aggregate([
    {
      $group: {
        _id: "$active",
        count: { $sum: 1 }
      }
    }
  ])
  .then(counts => {
    const activeCount = counts.find(c => c._id === true)?.count || 0;
    const inactiveCount = counts.find(c => c._id === false)?.count || 0;
    res.json({ activeCount, inactiveCount });
  })
  .catch(err => res.status(500).json({ error: err.message }));
};
