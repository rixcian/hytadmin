const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedAt: Date
});

mongoose.model('articles', articleSchema);