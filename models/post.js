const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  active: {
    type: Boolean,
    default: true
  },
  latitude: Number,
  longitude: Number
}, { timestamps: true });

// Add geospatial index
postSchema.index({ location: '2dsphere' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
