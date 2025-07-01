import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    unique: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['temp', 'large', 'duplicate', 'system', 'user'],
    default: 'user'
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  metadata: {
    extension: String,
    mimeType: String,
    permissions: String,
    owner: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
fileSchema.index({ path: 1 });
fileSchema.index({ category: 1 });
fileSchema.index({ size: -1 });
fileSchema.index({ lastModified: -1 });
fileSchema.index({ isDeleted: 1 });

const File = mongoose.model('File', fileSchema);

export default File; 