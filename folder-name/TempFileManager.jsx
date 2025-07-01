import React, { useState, useEffect } from 'react';
import { Trash2, Search, Filter, CheckCircle, AlertCircle, Loader, Download } from 'lucide-react';
import { generateMockFiles, formatBytes, formatNumber } from '../utils/mockData';
import toast from 'react-hot-toast';

const TempFileManager = () => {
  const [tempFiles, setTempFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isScanning, setIsScanning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupProgress, setCleanupProgress] = useState(0);
  const [deletedFilesReport, setDeletedFilesReport] = useState([]);

  useEffect(() => {
    scanTempFiles();
  }, []);

  const scanTempFiles = () => {
    setIsScanning(true);
    setTimeout(() => {
      const files = generateMockFiles(50).filter(file => 
        file.name.includes('.tmp') || 
        file.name.includes('.cache') || 
        file.name.includes('.log') || 
        file.name.includes('.bak') ||
        file.path.includes('/temp/') ||
        file.path.includes('/cache/')
      );
      setTempFiles(files);
      setIsScanning(false);
    }, 2000);
  };

  const filteredFiles = tempFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleFileSelection = (fileId) => {
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

  const cleanupSelected = () => {
    setIsCleaningUp(true);
    setCleanupProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setCleanupProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const selectedFilesData = tempFiles.filter(f => selectedFiles.has(f.id));
        const totalSize = selectedFilesData.reduce((sum, file) => sum + file.size, 0);
        setCleanupResult({
          filesRemoved: selectedFiles.size,
          spaceFreed: totalSize,
          categories: Array.from(new Set(selectedFilesData.map(f => f.type)))
        });
        setDeletedFilesReport(selectedFilesData);
        setTempFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
        setSelectedFiles(new Set());
        setIsCleaningUp(false);
        setCleanupProgress(0);
        toast.success('Cleanup completed successfully!');
      }
    }, 500);
  };

  const totalSelectedSize = tempFiles
    .filter(f => selectedFiles.has(f.id))
    .reduce((sum, file) => sum + file.size, 0);

  const fileTypes = Array.from(new Set(tempFiles.map(f => f.type)));

  const downloadReport = () => {
    if (!deletedFilesReport.length) return;
    const csv = [
      'Name,Path,Size,Type,Last Modified',
      ...deletedFilesReport.map(f => `${f.name},${f.path},${formatBytes(f.size)},${f.type},${f.lastModified.toLocaleDateString()}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deleted_files_report.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Report downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Temporary File Manager</h2>
        <p className="text-orange-100">Identify and clean up temporary files to free disk space</p>
      </div>
      {/* Cleanup Result */}
      {cleanupResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <h3 className="text-green-800 font-medium">Cleanup Completed Successfully!</h3>
              <p className="text-green-700 text-sm">
                Removed {formatNumber(cleanupResult.filesRemoved)} files and freed {formatBytes(cleanupResult.spaceFreed)}
              </p>
            </div>
          </div>
          <button onClick={downloadReport} className="ml-4 flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Download className="h-4 w-4 mr-1" /> Download Report
          </button>
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
            {isScanning ? 'Scanning...' : 'Scan Again'}
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
        {/* Progress Bar */}
        {isCleaningUp && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="h-2 rounded-full bg-red-500 transition-all duration-300"
              style={{ width: `${cleanupProgress}%` }}
            ></div>
          </div>
        )}
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
            <p className="text-gray-600">No temporary files found</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 ${
                  selectedFiles.has(file.id) ? 'bg-orange-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-4"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <span className="text-xs text-gray-500 ml-2">{formatBytes(file.size)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{file.path}</p>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {file.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Modified {file.lastModified.toLocaleDateString()}
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