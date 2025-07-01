import mongoose from 'mongoose';
import dotenv from 'dotenv';
import File from './models/File.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bytesweep';

// Additional sample data
const additionalFiles = [
  // More temp files
  {
    name: 'browser_cache.tmp',
    path: '/temp/browser_cache.tmp',
    size: 2048000, // 2MB
    type: 'tmp',
    category: 'temp',
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    metadata: {
      extension: 'tmp',
      mimeType: 'application/octet-stream',
      permissions: 'rw-r--r--',
      owner: 'system'
    }
  },
  {
    name: 'download_cache.cache',
    path: '/cache/download_cache.cache',
    size: 5120000, // 5MB
    type: 'cache',
    category: 'temp',
    lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    metadata: {
      extension: 'cache',
      mimeType: 'application/octet-stream',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'system_log_backup.log',
    path: '/logs/system_log_backup.log',
    size: 1048576, // 1MB
    type: 'log',
    category: 'temp',
    lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    metadata: {
      extension: 'log',
      mimeType: 'text/plain',
      permissions: 'rw-r--r--',
      owner: 'system'
    }
  },
  {
    name: 'old_backup.bak',
    path: '/backups/old_backup.bak',
    size: 3145728, // 3MB
    type: 'bak',
    category: 'temp',
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    metadata: {
      extension: 'bak',
      mimeType: 'application/octet-stream',
      permissions: 'rw-r--r--',
      owner: 'system'
    }
  },

  // More large files
  {
    name: 'movie_collection.mp4',
    path: '/videos/movie_collection.mp4',
    size: 3221225472, // 3GB
    type: 'mp4',
    category: 'large',
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    metadata: {
      extension: 'mp4',
      mimeType: 'video/mp4',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'game_installer.exe',
    path: '/downloads/game_installer.exe',
    size: 1610612736, // 1.5GB
    type: 'exe',
    category: 'large',
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    metadata: {
      extension: 'exe',
      mimeType: 'application/x-msdownload',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'database_backup.sql',
    path: '/backups/database_backup.sql',
    size: 805306368, // 750MB
    type: 'sql',
    category: 'large',
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    metadata: {
      extension: 'sql',
      mimeType: 'application/sql',
      permissions: 'rw-r--r--',
      owner: 'system'
    }
  },

  // More duplicate files
  {
    name: 'document_copy_2.pdf',
    path: '/documents/document_copy_2.pdf',
    size: 5242880, // 5MB
    type: 'pdf',
    category: 'duplicate',
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    metadata: {
      extension: 'pdf',
      mimeType: 'application/pdf',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'image_duplicate.jpg',
    path: '/images/image_duplicate.jpg',
    size: 2097152, // 2MB
    type: 'jpg',
    category: 'duplicate',
    lastModified: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    metadata: {
      extension: 'jpg',
      mimeType: 'image/jpeg',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'music_duplicate.mp3',
    path: '/music/music_duplicate.mp3',
    size: 8388608, // 8MB
    type: 'mp3',
    category: 'duplicate',
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    metadata: {
      extension: 'mp3',
      mimeType: 'audio/mpeg',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },

  // More user files
  {
    name: 'presentation.pptx',
    path: '/documents/presentation.pptx',
    size: 15728640, // 15MB
    type: 'pptx',
    category: 'user',
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    metadata: {
      extension: 'pptx',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'spreadsheet.xlsx',
    path: '/documents/spreadsheet.xlsx',
    size: 5242880, // 5MB
    type: 'xlsx',
    category: 'user',
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    metadata: {
      extension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'archive.zip',
    path: '/archives/archive.zip',
    size: 104857600, // 100MB
    type: 'zip',
    category: 'user',
    lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    metadata: {
      extension: 'zip',
      mimeType: 'application/zip',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  }
];

async function addMoreData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert additional files
    const insertedFiles = await File.insertMany(additionalFiles);
    console.log(`Added ${insertedFiles.length} more files to the database`);

    // Calculate new totals
    const totalFiles = await File.countDocuments({ isDeleted: false });
    const totalSizeResult = await File.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    const totalSize = totalSizeResult.length > 0 ? totalSizeResult[0].totalSize : 0;

    const tempFiles = await File.countDocuments({ category: 'temp', isDeleted: false });
    const tempSizeResult = await File.aggregate([
      { $match: { category: 'temp', isDeleted: false } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    const tempSize = tempSizeResult.length > 0 ? tempSizeResult[0].totalSize : 0;

    const largeFiles = await File.countDocuments({ category: 'large', isDeleted: false });
    const largeSizeResult = await File.aggregate([
      { $match: { category: 'large', isDeleted: false } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    const largeSize = largeSizeResult.length > 0 ? largeSizeResult[0].totalSize : 0;

    const duplicateFiles = await File.countDocuments({ category: 'duplicate', isDeleted: false });
    const duplicateSizeResult = await File.aggregate([
      { $match: { category: 'duplicate', isDeleted: false } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    const duplicateSize = duplicateSizeResult.length > 0 ? duplicateSizeResult[0].totalSize : 0;

    console.log('\nUpdated database summary:');
    console.log(`- Total files: ${totalFiles}`);
    console.log(`- Total size: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`- Temp files: ${tempFiles} (${(tempSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`- Large files: ${largeFiles} (${(largeSize / 1024 / 1024 / 1024).toFixed(2)} GB)`);
    console.log(`- Duplicate files: ${duplicateFiles} (${(duplicateSize / 1024 / 1024).toFixed(2)} MB)`);

    console.log('\n✅ Additional data added successfully!');
    console.log('🌐 Refresh your browser to see the new data in the dashboard');

  } catch (error) {
    console.error('Error adding more data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
addMoreData(); 