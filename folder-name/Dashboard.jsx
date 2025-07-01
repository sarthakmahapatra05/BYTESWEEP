import React from 'react';
import { HardDrive, FileText, Trash2, Copy, Zap, AlertTriangle } from 'lucide-react';
import { mockSystemStats, mockDiskInfo, formatBytes, formatNumber } from '../utils/mockData';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">System Overview</h2>
        <p className="text-blue-100">Monitor and optimize your system's file performance</p>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(mockSystemStats.totalFiles)}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(mockSystemStats.totalSize)} total size</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temp Files</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(mockSystemStats.tempFiles)}</p>
            </div>
            <Trash2 className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(mockSystemStats.tempSize)} can be cleaned</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Large Files</p>
              <p className="text-2xl font-bold text-red-600">{formatNumber(mockSystemStats.largeFiles)}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(mockSystemStats.largeSize)} in large files</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Duplicates</p>
              <p className="text-2xl font-bold text-purple-600">{formatNumber(mockSystemStats.duplicateFiles)}</p>
            </div>
            <Copy className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(mockSystemStats.duplicateSize)} duplicated</p>
        </div>
      </div>
      {/* Disk Usage */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HardDrive className="h-5 w-5 mr-2 text-gray-600" />
          Disk Usage
        </h3>
        <div className="space-y-4">
          {mockDiskInfo.map((disk) => (
            <div key={disk.drive} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Drive {disk.drive}</span>
                <span className="text-sm text-gray-500">
                  {formatBytes(disk.usedSpace)} / {formatBytes(disk.totalSpace)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    disk.usage > 80 ? 'bg-red-500' : disk.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${disk.usage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatBytes(disk.freeSpace)} free</span>
                <span>{disk.usage}% used</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Recommendations */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Performance Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Clean temporary files</p>
              <p className="text-sm text-gray-600">Free up {formatBytes(mockSystemStats.tempSize)} by removing temporary files</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Review large files</p>
              <p className="text-sm text-gray-600">Identify and manage {formatNumber(mockSystemStats.largeFiles)} large files consuming significant space</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Remove duplicates</p>
              <p className="text-sm text-gray-600">Eliminate {formatNumber(mockSystemStats.duplicateFiles)} duplicate files to save {formatBytes(mockSystemStats.duplicateSize)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 