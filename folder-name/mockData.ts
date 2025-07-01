import { FileInfo, DiskInfo, SystemStats } from '../types';

export const generateMockFiles = (count: number): FileInfo[] => {
  const fileTypes = ['.tmp', '.log', '.cache', '.bak', '.old', '.temp', '.pdf', '.docx', '.jpg', '.mp4', '.zip'];
  const directories = ['/temp/', '/cache/', '/logs/', '/downloads/', '/documents/', '/desktop/', '/system/'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `file-${i}`,
    name: `file_${i}${fileTypes[Math.floor(Math.random() * fileTypes.length)]}`,
    path: `${directories[Math.floor(Math.random() * directories.length)]}file_${i}`,
    size: Math.floor(Math.random() * 1000000000) + 1000, // 1KB to 1GB
    type: fileTypes[Math.floor(Math.random() * fileTypes.length)].slice(1),
    lastModified: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
    category: Math.random() > 0.5 ? 'temp' : 'user'
  }));
};

export const mockDiskInfo: DiskInfo[] = [
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

export const mockSystemStats: SystemStats = {
  totalFiles: 125847,
  totalSize: 450000000000, // 450GB
  tempFiles: 3247,
  tempSize: 8500000000, // 8.5GB
  largeFiles: 156,
  largeSize: 125000000000, // 125GB
  duplicateFiles: 892,
  duplicateSize: 2300000000 // 2.3GB
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};