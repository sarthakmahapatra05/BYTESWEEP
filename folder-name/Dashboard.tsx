import React, { useState, useEffect } from 'react';
import { HardDrive, FileText, Trash2, Copy, Zap, AlertTriangle } from 'lucide-react';
import { systemAPI } from '../services/api';
import { formatBytes, formatNumber } from '../utils/mockData';
import { SystemStats, DiskInfo } from '../types';

const Dashboard: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [diskInfo, setDiskInfo] = useState<DiskInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, disksResponse] = await Promise.all([
          systemAPI.getStats(),
          systemAPI.getDisks()
        ]);
        
        setSystemStats(statsResponse.data);
        setDiskInfo(disksResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">System Overview</h2>
          <p className="text-blue-100">Loading system data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-md border border-gray-100 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  if (!systemStats) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">No Data</h2>
          <p className="text-yellow-100">No system statistics available</p>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-900">{formatNumber(systemStats.totalFiles)}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(systemStats.totalSize)} total size</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temp Files</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(systemStats.tempFiles)}</p>
            </div>
            <Trash2 className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(systemStats.tempSize)} can be cleaned</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Large Files</p>
              <p className="text-2xl font-bold text-red-600">{formatNumber(systemStats.largeFiles)}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(systemStats.largeSize)} in large files</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Duplicates</p>
              <p className="text-2xl font-bold text-purple-600">{formatNumber(systemStats.duplicateFiles)}</p>
            </div>
            <Copy className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(systemStats.duplicateSize)} duplicated</p>
        </div>
      </div>

      {/* Disk Usage */}
      {diskInfo.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-gray-600" />
            Disk Usage
          </h3>
          <div className="space-y-4">
            {diskInfo.map((disk) => (
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
      )}

      {/* Performance Recommendations */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Performance Recommendations
        </h3>
        <div className="space-y-3">
          {systemStats.tempSize > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Clean temporary files</p>
                <p className="text-sm text-gray-600">Free up {formatBytes(systemStats.tempSize)} by removing temporary files</p>
              </div>
            </div>
          )}
          {systemStats.largeSize > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Review large files</p>
                <p className="text-sm text-gray-600">Identify and manage {formatNumber(systemStats.largeFiles)} large files consuming significant space</p>
              </div>
            </div>
          )}
          {systemStats.duplicateSize > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Remove duplicates</p>
                <p className="text-sm text-gray-600">Eliminate {formatNumber(systemStats.duplicateFiles)} duplicate files to save {formatBytes(systemStats.duplicateSize)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;