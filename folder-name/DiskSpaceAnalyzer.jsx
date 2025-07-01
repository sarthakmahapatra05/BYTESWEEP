import React, { useState, useEffect } from 'react';
import { HardDrive, PieChart, BarChart3, RefreshCw, Folder } from 'lucide-react';
import { mockDiskInfo, formatBytes, formatNumber } from '../utils/mockData';

const DiskSpaceAnalyzer = () => {
  const [selectedDrive, setSelectedDrive] = useState(mockDiskInfo[0]);
  const [directories, setDirectories] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewType, setViewType] = useState('chart');

  useEffect(() => {
    analyzeDiskSpace();
  }, [selectedDrive]);

  const analyzeDiskSpace = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const mockDirectories = [
        { name: 'Program Files', path: '/Program Files', size: 85000000000, fileCount: 12847, percentage: 24.3 },
        { name: 'Users', path: '/Users', size: 78000000000, fileCount: 89234, percentage: 22.3 },
        { name: 'Windows', path: '/Windows', size: 45000000000, fileCount: 156789, percentage: 12.9 },
        { name: 'Program Files (x86)', path: '/Program Files (x86)', size: 32000000000, fileCount: 8932, percentage: 9.1 },
        { name: 'ProgramData', path: '/ProgramData', size: 28000000000, fileCount: 4567, percentage: 8.0 },
        { name: 'System Volume Information', path: '/System Volume Information', size: 15000000000, fileCount: 234, percentage: 4.3 },
        { name: 'Temp', path: '/Temp', size: 12000000000, fileCount: 3456, percentage: 3.4 },
        { name: 'Other', path: '/Other', size: 55000000000, fileCount: 23456, percentage: 15.7 }
      ];
      setDirectories(mockDirectories);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getUsageColor = (percentage) => {
    if (percentage > 80) return 'text-red-600';
    if (percentage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBarColor = (percentage) => {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Disk Space Analyzer</h2>
        <p className="text-blue-100">Analyze disk usage and identify space-consuming directories</p>
      </div>
      {/* Drive Selection */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Drive</label>
              <select
                value={selectedDrive.drive}
                onChange={(e) => setSelectedDrive(mockDiskInfo.find(d => d.drive === e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mockDiskInfo.map(drive => (
                  <option key={drive.drive} value={drive.drive}>
                    Drive {drive.drive} - {formatBytes(drive.totalSpace)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType('chart')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewType === 'chart' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <PieChart className="h-4 w-4 inline mr-1" />
                  Chart
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewType === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  List
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={analyzeDiskSpace}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
      {/* Drive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Space</p>
              <p className="text-2xl font-bold text-gray-900">{formatBytes(selectedDrive.totalSpace)}</p>
            </div>
            <HardDrive className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Used Space</p>
              <p className={`text-2xl font-bold ${getUsageColor(selectedDrive.usage)}`}>
                {formatBytes(selectedDrive.usedSpace)}
              </p>
            </div>
            <div className={`text-2xl font-bold ${getUsageColor(selectedDrive.usage)}`}>
              {selectedDrive.usage}%
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getBarColor(selectedDrive.usage)}`}
              style={{ width: `${selectedDrive.usage}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Free Space</p>
              <p className="text-2xl font-bold text-green-600">{formatBytes(selectedDrive.freeSpace)}</p>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {100 - selectedDrive.usage}%
            </div>
          </div>
        </div>
      </div>
      {/* Directory Analysis */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Folder className="h-5 w-5 mr-2 text-gray-600" />
            Directory Usage Analysis
          </h3>
        </div>
        {isAnalyzing ? (
          <div className="p-8 text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Analyzing directory sizes...</p>
          </div>
        ) : viewType === 'chart' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart Representation */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Directory Distribution</h4>
                <div className="space-y-2">
                  {directories.map((dir, index) => (
                    <div key={dir.name} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">{dir.name}</span>
                          <span className="text-sm text-gray-500">{dir.percentage}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 truncate">{dir.path}</span>
                          <span className="text-xs text-gray-500">{formatBytes(dir.size)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Visual Chart */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Usage Breakdown</h4>
                <div className="space-y-3">
                  {directories.map((dir, index) => (
                    <div key={dir.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{dir.name}</span>
                        <span className="text-gray-500">{formatBytes(dir.size)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${colors[index % colors.length]}`}
                          style={{ width: `${dir.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {directories.map((dir, index) => (
              <div key={dir.name} className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className={`w-3 h-3 rounded-full mr-4 ${colors[index % colors.length]}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{dir.name}</p>
                    <span className="text-sm font-medium text-gray-900 ml-2">{formatBytes(dir.size)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{dir.path}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {formatNumber(dir.fileCount)} files
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {dir.percentage}% of drive
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

export default DiskSpaceAnalyzer; 