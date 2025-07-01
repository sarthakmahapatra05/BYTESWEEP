import React, { useState, useEffect } from 'react';
import { Trash2, Search, Filter, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { FileInfo, CleanupResult } from '../types';
import { fileAPI, cleanupAPI } from '../services/api';
import { formatBytes, formatNumber } from '../utils/mockData';

const TempFileManager: React.FC = () => {
  const [tempFiles, setTempFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isScanning, setIsScanning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scanTempFiles();
  }, []);

  const scanTempFiles = async () => {
    try {
      setIsScanning(true);
      setError(null);
      
      const response = await fileAPI.getFilesByCategory('temp', { limit: 100 });
      setTempFiles(response.data.files);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching temp files:', err);
      setError('Failed to load temporary files');
      setLoading(false);
    } finally {
      setIsScanning(false);
    }
  };

  const filteredFiles = tempFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const selectAll = () => {
    setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
  };

  const deselectAll = () => {
    setSelectedFiles(new Set());
  };

  const cleanupSelected = async () => {
    try {
      setIsCleaningUp(true);
      setError(null);
      
      const fileIds = Array.from(selectedFiles);
      const response = await cleanupAPI.cleanupLargeFiles(fileIds, true);
      
      setCleanupResult({
        filesRemoved: response.data.filesRemoved,
        spaceFreed: response.data.spaceFreed,
        categories: response.data.categories
      });
      
      // Refresh the file list
      await scanTempFiles();
      setSelectedFiles(new Set());
    } catch (err) {
      console.error('Error during cleanup:', err);
      setError('Failed to clean up selected files');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const totalSelectedSize = tempFiles
    .filter(f => selectedFiles.has(f.id))
    .reduce((sum, file) => sum + file.size, 0);

  const fileTypes = Array.from(new Set(tempFiles.map(f => f.type)));

  if (loading && !isScanning) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Temporary File Manager</h2>
          <p className="text-orange-100">Loading temporary files...</p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 text-center">
          <Loader className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading temporary files from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Temporary File Manager</h2>
          <p className="text-red-100">Error loading data</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={scanTempFiles}
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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Temporary File Manager</h2>
        <p className="text-orange-100">Identify and clean up temporary files to free disk space</p>
      </div>

      {/* Cleanup Result */}
      {cleanupResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <h3 className="text-green-800 font-medium">Cleanup Completed Successfully!</h3>
              <p className="text-green-700 text-sm">
                Removed {formatNumber(cleanupResult.filesRemoved)} files and freed {formatBytes(cleanupResult.spaceFreed)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Types</option>
                {fileTypes.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={scanTempFiles}
            disabled={isScanning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isScanning ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            {isScanning ? 'Scanning...' : 'Refresh'}
          </button>
        </div>

        {/* Selection Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Deselect All
            </button>
          </div>
          
          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formatNumber(selectedFiles.size)} files selected ({formatBytes(totalSelectedSize)})
              </span>
              <button
                onClick={cleanupSelected}
                disabled={isCleaningUp}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isCleaningUp ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                {isCleaningUp ? 'Cleaning...' : 'Clean Selected'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Temporary Files ({formatNumber(filteredFiles.length)})
          </h3>
        </div>
        
        {isScanning ? (
          <div className="p-8 text-center">
            <Loader className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Scanning for temporary files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No temporary files found in database</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredFiles.map((file) => (
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
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 truncate">{file.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">{formatBytes(file.size)}</span>
                    <span className="text-gray-500">{file.type.toUpperCase()}</span>
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

export default TempFileManager;