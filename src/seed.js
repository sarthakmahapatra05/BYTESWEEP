import mongoose from 'mongoose';
import dotenv from 'dotenv';
import File from './models/File.js';
import SystemStats from './models/SystemStats.js';
import DiskInfo from './models/DiskInfo.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bytesweep';

// Sample data for seeding
const sampleFiles = [
  {
    name: 'temp_file_1.tmp',
    path: '/temp/temp_file_1.tmp',
    size: 1024000, // 1MB
    type: 'tmp',
    category: 'temp',
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    metadata: {
      extension: 'tmp',
      mimeType: 'application/octet-stream',
      permissions: 'rw-r--r--',
      owner: 'system'
    }
  },
  {
    name: 'large_video.mp4',
    path: '/videos/large_video.mp4',
    size: 2147483648, // 2GB
    type: 'mp4',
    category: 'large',
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    metadata: {
      extension: 'mp4',
      mimeType: 'video/mp4',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'document_copy.pdf',
    path: '/documents/document_copy.pdf',
    size: 5242880, // 5MB
    type: 'pdf',
    category: 'duplicate',
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    metadata: {
      extension: 'pdf',
      mimeType: 'application/pdf',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  },
  {
    name: 'system_log.log',
    path: '/logs/system_log.log',
    size: 1048576, // 1MB
    type: 'log',
    category: 'system',
    lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    metadata: {
      extension: 'log',
      mimeType: 'text/plain',
      permissions: 'rw-r--r--',
      owner: 'system'
    }
  },
  {
    name: 'user_document.docx',
    path: '/documents/user_document.docx',
    size: 2097152, // 2MB
    type: 'docx',
    category: 'user',
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    metadata: {
      extension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      permissions: 'rw-r--r--',
      owner: 'user'
    }
  }
];

const sampleDiskInfo = [
  {
    drive: 'C:',
    totalSpace: 500000000000, // 500GB
    usedSpace: 350000000000,  // 350GB
    freeSpace: 150000000000,  // 150GB
    usage: 70
  },
  {
    drive: 'D:',
    totalSpace: 1000000000000, // 1TB
    usedSpace: 200000000000,   // 200GB
    freeSpace: 800000000000,   // 800GB
    usage: 20
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await File.deleteMany({});
    await SystemStats.deleteMany({});
    await DiskInfo.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample files
    const insertedFiles = await File.insertMany(sampleFiles);
    console.log(`Inserted ${insertedFiles.length} files`);

    // Calculate system stats from inserted files
    const totalFiles = insertedFiles.length;
    const totalSize = insertedFiles.reduce((sum, file) => sum + file.size, 0);
    
    const tempFiles = insertedFiles.filter(file => file.category === 'temp').length;
    const tempSize = insertedFiles
      .filter(file => file.category === 'temp')
      .reduce((sum, file) => sum + file.size, 0);
    
    const largeFiles = insertedFiles.filter(file => file.category === 'large').length;
    const largeSize = insertedFiles
      .filter(file => file.category === 'large')
      .reduce((sum, file) => sum + file.size, 0);
    
    const duplicateFiles = insertedFiles.filter(file => file.category === 'duplicate').length;
    const duplicateSize = insertedFiles
      .filter(file => file.category === 'duplicate')
      .reduce((sum, file) => sum + file.size, 0);

    // Insert system stats
    const systemStats = new SystemStats({
      totalFiles,
      totalSize,
      tempFiles,
      tempSize,
      largeFiles,
      largeSize,
      duplicateFiles,
      duplicateSize
    });
    await systemStats.save();
    console.log('Inserted system stats');

    // Insert disk info
    await DiskInfo.insertMany(sampleDiskInfo);
    console.log('Inserted disk information');

    console.log('Database seeded successfully!');
    console.log('\nSample data summary:');
    console.log(`- Total files: ${totalFiles}`);
    console.log(`- Total size: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`- Temp files: ${tempFiles} (${(tempSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`- Large files: ${largeFiles} (${(largeSize / 1024 / 1024 / 1024).toFixed(2)} GB)`);
    console.log(`- Duplicate files: ${duplicateFiles} (${(duplicateSize / 1024 / 1024).toFixed(2)} MB)`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase(); 