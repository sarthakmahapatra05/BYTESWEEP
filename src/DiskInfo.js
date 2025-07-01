import mongoose from 'mongoose';

const diskInfoSchema = new mongoose.Schema({
  drive: {
    type: String,
    required: true,
    unique: true
  },
  totalSpace: {
    type: Number,
    required: true
  },
  usedSpace: {
    type: Number,
    required: true
  },
  freeSpace: {
    type: Number,
    required: true
  },
  usage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const DiskInfo = mongoose.model('DiskInfo', diskInfoSchema);

export default DiskInfo; 