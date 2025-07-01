import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// File API
export const fileAPI = {
  // Get all files with pagination and filtering
  getFiles: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) => api.get('/files', { params }),

  // Get file by ID
  getFile: (id: string) => api.get(`/files/${id}`),

  // Create new file
  createFile: (fileData: any) => api.post('/files', fileData),

  // Update file
  updateFile: (id: string, fileData: any) => api.put(`/files/${id}`, fileData),

  // Delete file
  deleteFile: (id: string) => api.delete(`/files/${id}`),

  // Get files by category
  getFilesByCategory: (category: string, params?: { page?: number; limit?: number }) =>
    api.get(`/files/category/${category}`, { params }),

  // Get large files
  getLargeFiles: (minSize: number, params?: { page?: number; limit?: number }) =>
    api.get(`/files/large/${minSize}`, { params }),
};

// System API
export const systemAPI = {
  // Get system statistics
  getStats: () => api.get('/system/stats'),

  // Update system statistics
  updateStats: (statsData: any) => api.post('/system/stats', statsData),

  // Get disk information
  getDisks: () => api.get('/system/disks'),

  // Update disk information
  updateDisk: (diskData: any) => api.post('/system/disks', diskData),

  // Get file statistics by category
  getFilesByCategory: () => api.get('/system/files-by-category'),

  // Get file size distribution
  getFileSizeDistribution: () => api.get('/system/file-size-distribution'),

  // Get recent files
  getRecentFiles: (limit?: number) => api.get('/system/recent-files', { params: { limit } }),

  // Get system health
  getHealth: () => api.get('/system/health'),
};

// Cleanup API
export const cleanupAPI = {
  // Clean up temporary files
  cleanupTempFiles: (confirm: boolean) => api.post('/cleanup/temp-files', { confirm }),

  // Clean up large files
  cleanupLargeFiles: (fileIds: string[], confirm: boolean) =>
    api.post('/cleanup/large-files', { fileIds, confirm }),

  // Clean up duplicate files
  cleanupDuplicateFiles: (fileIds: string[], confirm: boolean) =>
    api.post('/cleanup/duplicate-files', { fileIds, confirm }),

  // Bulk cleanup by category
  bulkCleanup: (categories: string[], confirm: boolean) =>
    api.post('/cleanup/bulk', { categories, confirm }),

  // Get cleanup preview
  getCleanupPreview: (category: string, limit?: number) =>
    api.get(`/cleanup/preview/${category}`, { params: { limit } }),

  // Restore deleted files
  restoreFiles: (fileIds: string[]) => api.post('/cleanup/restore', { fileIds }),

  // Get cleanup statistics
  getCleanupStats: () => api.get('/cleanup/stats'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 