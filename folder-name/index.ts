export interface FileInfo {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  lastModified: Date;
  category?: 'temp' | 'large' | 'duplicate' | 'system' | 'user';
}

export interface DiskInfo {
  drive: string;
  totalSpace: number;
  usedSpace: number;
  freeSpace: number;
  usage: number;
}

export interface SystemStats {
  totalFiles: number;
  totalSize: number;
  tempFiles: number;
  tempSize: number;
  largeFiles: number;
  largeSize: number;
  duplicateFiles: number;
  duplicateSize: number;
}

export interface CleanupResult {
  filesRemoved: number;
  spaceFreed: number;
  categories: string[];
}