import React, { useState } from 'react';
import { 
  Home, 
  Trash2, 
  AlertTriangle, 
  HardDrive, 
  FolderOpen, 
  Zap, 
  Menu, 
  X,
  Settings,
  Info
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TempFileManager from './components/TempFileManager';
import LargeFileAnalyzer from './components/LargeFileAnalyzer';
import DiskSpaceAnalyzer from './components/DiskSpaceAnalyzer';
import FileOrganizer from './components/FileOrganizer';
import PerformanceOptimizer from './components/PerformanceOptimizer';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-blue-600' },
    { id: 'temp-files', name: 'Temp File Manager', icon: Trash2, color: 'text-orange-600' },
    { id: 'large-files', name: 'Large File Analyzer', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'disk-space', name: 'Disk Space Analyzer', icon: HardDrive, color: 'text-indigo-600' },
    { id: 'file-organizer', name: 'File Organizer', icon: FolderOpen, color: 'text-green-600' },
    { id: 'performance', name: 'Performance Optimizer', icon: Zap, color: 'text-purple-600' }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'temp-files':
        return <TempFileManager />;
      case 'large-files':
        return <LargeFileAnalyzer />;
      case 'disk-space':
        return <DiskSpaceAnalyzer />;
      case 'file-organizer':
        return <FileOrganizer />;
      case 'performance':
        return <PerformanceOptimizer />;
      default:
        return <Dashboard />;
    }
  };

  const currentItem = navigationItems.find(item => item.id === activeView);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">File Manager</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : item.color}`} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Info className="h-4 w-4" />
            <span>System File Management Tool v1.0</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Keep your system optimized and organized
          </p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center space-x-2">
              {currentItem && (
                <>
                  <currentItem.icon className={`h-5 w-5 ${currentItem.color}`} />
                  <h1 className="text-lg font-semibold text-gray-900">{currentItem.name}</h1>
                </>
              )}
            </div>
            <div className="w-9"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App; 