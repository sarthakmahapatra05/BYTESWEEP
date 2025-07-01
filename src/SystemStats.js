import mongoose from 'mongoose';

const systemStatsSchema = new mongoose.Schema({
  totalFiles: {
    type: Number,
    required: true,
    default: 0
  },
  totalSize: {
    type: Number,
    required: true,
    default: 0
  },
  tempFiles: {
    type: Number,
    required: true,
    default: 0
  },
  tempSize: {
    type: Number,
    required: true,
    default: 0
  },
  largeFiles: {
    type: Number,
    required: true,
    default: 0
  },
  largeSize: {
    type: Number,
    required: true,
    default: 0
  },
  duplicateFiles: {
    type: Number,
    required: true,
    default: 0
  },
  duplicateSize: {
    type: Number,
    required: true,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const SystemStats = mongoose.model('SystemStats', systemStatsSchema);

export default SystemStats; 