import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, FolderOpen, Eye, Trash2, Loader } from 'lucide-react';
import { generateMockFiles, formatBytes, formatNumber } from '../utils/mockData';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

const LargeFileAnalyzer = () => {
  const [largeFiles, setLargeFiles] = useState([]);
  const [sizeThreshold, setSizeThreshold] = useState(100); // MB
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('size');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    scanLargeFiles();
  }, [sizeThreshold]);

  const scanLargeFiles = () => {
    setIsScanning(true);
    setTimeout(() => {
      const files = generateMockFiles(30)
        .filter(file => file.size > sizeThreshold * 1024 * 1024)
        .sort((a, b) => sortOrder === 'desc' ? b.size - a.size : a.size - b.size);
      setLargeFiles(files);
      setIsScanning(false);
    }, 1500);
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
          compareValue = a.lastModified.getTime() - b.lastModified.getTime();
          break;
        default:
          compareValue = 0;
      }
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

  const totalSize = largeFiles.reduce((sum, file) => sum + file.size, 0);
  const selectedSize = largeFiles
    .filter(f => selectedFiles.has(f.id))
    .reduce((sum, file) => sum + file.size, 0);

  const toggleFileSelection = (fileId) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const openModal = (file) => {
    setModalFile(file);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalFile(null);
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setLargeFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
    setShowDeleteConfirm(false);
    toast.success('Selected files deleted!');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getSizeColor = (size) => {
    if (size > 1000 * 1024 * 1024) return 'text-red-600'; // > 1GB
    if (size > 500 * 1024 * 1024) return 'text-orange-600'; // > 500MB
    return 'text-yellow-600'; // > threshold
  };

  const getSizeBadgeColor = (size) => {
    if (size > 1000 * 1024 * 1024) return 'bg-red-100 text-red-800';
    if (size > 500 * 1024 * 1024) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="File Details"
        ariaHideApp={false}
        className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-24 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        {modalFile && (
          <div>
            <h2 className="text-xl font-bold mb-2">{modalFile.name}</h2>
            <p className="text-gray-700 mb-1">Path: {modalFile.path}</p>
            <p className="text-gray-700 mb-1">Size: {formatBytes(modalFile.size)}</p>
            <p className="text-gray-700 mb-1">Type: {modalFile.type}</p>
            <p className="text-gray-700 mb-1">Last Modified: {modalFile.lastModified.toLocaleDateString()}</p>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={showDeleteConfirm}
        onRequestClose={cancelDelete}
        contentLabel="Confirm Delete"
        ariaHideApp={false}
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto mt-24 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <h2 className="text-lg font-bold mb-4">Delete Selected Files?</h2>
        <p className="mb-4">Are you sure you want to delete the selected files? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </Modal>
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
              onChange={(e) => setSortBy(e.target.value)}
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
              onChange={(e) => setSortOrder(e.target.value)}
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
            {isScanning ? 'Scanning...' : 'Scan Files'}
          </button>
          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formatNumber(selectedFiles.size)} files selected ({formatBytes(selectedSize)})
              </span>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center" onClick={handleDeleteSelected}>
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
            <p className="text-gray-600">Analyzing large files...</p>
          </div>
        ) : filteredAndSortedFiles.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No large files found above {sizeThreshold}MB</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredAndSortedFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 ${
                  selectedFiles.has(file.id) ? 'bg-red-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mr-4"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <span className={`text-sm font-bold ml-2 ${getSizeColor(file.size)}`}>
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{file.path}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSizeBadgeColor(file.size)}`}>
                        {file.size > 1000 * 1024 * 1024 ? 'HUGE' : file.size > 500 * 1024 * 1024 ? 'LARGE' : 'BIG'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        Modified {file.lastModified.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600" onClick={() => openModal(file)}>
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
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