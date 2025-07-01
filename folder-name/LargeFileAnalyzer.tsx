import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, FolderOpen, Eye, Trash2, Loader } from 'lucide-react';
import { FileInfo } from '../types';
import { fileAPI, cleanupAPI } from '../services/api';
import { formatBytes, formatNumber } from '../utils/mockData';

const LargeFileAnalyzer: React.FC = () => {
  const [largeFiles, setLargeFiles] = useState<FileInfo[]>([]);
  const [sizeThreshold, setSizeThreshold] = useState(100); // MB
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'size' | 'name' | 'date'>('size');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scanLargeFiles();
  }, [sizeThreshold]);

  const scanLargeFiles = async () => {
    try {
      setIsScanning(true);
      setError(null);
      
      const minSizeBytes = sizeThreshold * 1024 * 1024; // Convert MB to bytes
      const response = await fileAPI.getLargeFiles(minSizeBytes, { limit: 100 });
      setLargeFiles(response.data.files);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching large files:', err);
      setError('Failed to load large files');
      setLoading(false);
    } finally {
      setIsScanning(false);
    }
  };

  const filteredAndSortedFiles = largeFiles
    .filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let compareValue = 0;
      switch (sortBy) {
        case 'size':
          compareValue = a.size - b.size;
          break;
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'date':
          compareValue = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
          break;
      }
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

  const totalSize = largeFiles.reduce((sum, file) => sum + file.size, 0);
  const selectedSize = largeFiles
    .filter(f => selectedFiles.has(f.id))
    .reduce((sum, file) => sum + file.size, 0);

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const deleteSelected = async () => {
    try {
      const fileIds = Array.from(selectedFiles);
      await cleanupAPI.cleanupLargeFiles(fileIds, true);
      
      // Refresh the file list
      await scanLargeFiles();
      setSelectedFiles(new Set());
    } catch (err) {
      console.error('Error deleting files:', err);
      setError('Failed to delete selected files');
    }
  };

  const getSizeColor = (size: number) => {
    if (size > 1000 * 1024 * 1024) return 'text-red-600'; // > 1GB
    if (size > 500 * 1024 * 1024) return 'text-orange-600'; // > 500MB
    return 'text-yellow-600'; // > threshold
  };

  const getSizeBadgeColor = (size: number) => {
    if (size > 1000 * 1024 * 1024) return 'bg-red-100 text-red-800';
    if (size > 500 * 1024 * 1024) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading && !isScanning) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Large File Analyzer</h2>
          <p className="text-red-100">Loading large files...</p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 text-center">
          <Loader className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading large files from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Large File Analyzer</h2>
          <p className="text-red-100">Error loading data</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={scanLargeFiles}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Large File Analyzer</h2>
        <p className="text-red-100">Identify files consuming significant disk space</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Large Files Found</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(largeFiles.length)}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">{formatBytes(totalSize)}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Threshold</p>
              <p className="text-2xl font-bold text-gray-900">{sizeThreshold} MB</p>
            </div>
            <Filter className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Threshold (MB)
            </label>
            <input
              type="number"
              value={sizeThreshold}
              onChange={(e) => setSizeThreshold(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'size' | 'name' | 'date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="size">Size</option>
              <option value="name">Name</option>
              <option value="date">Date Modified</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="desc">Largest First</option>
              <option value="asc">Smallest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={scanLargeFiles}
            disabled={isScanning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isScanning ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            {isScanning ? 'Scanning...' : 'Refresh'}
          </button>

          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formatNumber(selectedFiles.size)} files selected ({formatBytes(selectedSize)})
              </span>
              <button 
                onClick={deleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Large Files ({formatNumber(filteredAndSortedFiles.length)})
          </h3>
        </div>
        
        {isScanning ? (
          <div className="p-8 text-center">
            <Loader className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Scanning for large files...</p>
          </div>
        ) : filteredAndSortedFiles.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No large files found in database</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredAndSortedFiles.map((file) => (
              <div
                key={file.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  selectedFiles.has(file.id) ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 truncate">{file.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`font-medium ${getSizeColor(file.size)}`}>
                      {formatBytes(file.size)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSizeBadgeColor(file.size)}`}>
                      {file.type.toUpperCase()}
                    </span>
                    <span className="text-gray-400">
                      {new Date(file.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LargeFileAnalyzer;