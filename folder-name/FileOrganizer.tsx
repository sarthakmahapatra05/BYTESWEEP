import React, { useState, useEffect } from 'react';
import { FolderOpen, ArrowRight, Settings, Play, CheckCircle, Clock, Zap } from 'lucide-react';
import { formatBytes, formatNumber } from '../utils/mockData';

interface OrganizationRule {
  id: string;
  name: string;
  source: string;
  destination: string;
  fileTypes: string[];
  condition: 'extension' | 'size' | 'age' | 'name';
  enabled: boolean;
  lastRun?: Date;
  filesProcessed?: number;
}

interface OrganizationTask {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  filesProcessed: number;
  totalFiles: number;
  startTime?: Date;
  endTime?: Date;
}

const FileOrganizer: React.FC = () => {
  const [rules, setRules] = useState<OrganizationRule[]>([]);
  const [tasks, setTasks] = useState<OrganizationTask[]>([]);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRule, setNewRule] = useState<Partial<OrganizationRule>>({
    name: '',
    source: '',
    destination: '',
    fileTypes: [],
    condition: 'extension',
    enabled: true
  });

  useEffect(() => {
    // Initialize with some default rules
    setRules([
      {
        id: '1',
        name: 'Organize Downloads',
        source: '/Downloads',
        destination: '/Downloads/Organized',
        fileTypes: ['pdf', 'docx', 'xlsx', 'pptx'],
        condition: 'extension',
        enabled: true,
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
        filesProcessed: 47
      },
      {
        id: '2',
        name: 'Clean Desktop',
        source: '/Desktop',
        destination: '/Desktop/Archive',
        fileTypes: ['*'],
        condition: 'age',
        enabled: true,
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        filesProcessed: 23
      },
      {
        id: '3',
        name: 'Sort Media Files',
        source: '/Downloads',
        destination: '/Media',
        fileTypes: ['jpg', 'png', 'mp4', 'mov', 'mp3'],
        condition: 'extension',
        enabled: false,
        filesProcessed: 0
      }
    ]);
  }, []);

  const runRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    const task: OrganizationTask = {
      id: Date.now().toString(),
      name: rule.name,
      status: 'running',
      progress: 0,
      filesProcessed: 0,
      totalFiles: Math.floor(Math.random() * 100) + 10,
      startTime: new Date()
    };

    setTasks(prev => [task, ...prev]);

    // Simulate task progress
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === task.id && t.status === 'running') {
          const newProgress = Math.min(t.progress + Math.random() * 15, 100);
          const newFilesProcessed = Math.floor((newProgress / 100) * t.totalFiles);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...t,
              status: 'completed',
              progress: 100,
              filesProcessed: t.totalFiles,
              endTime: new Date()
            };
          }
          
          return {
            ...t,
            progress: newProgress,
            filesProcessed: newFilesProcessed
          };
        }
        return t;
      }));
    }, 500);

    // Update rule last run
    setRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { ...r, lastRun: new Date(), filesProcessed: (r.filesProcessed || 0) + task.totalFiles }
        : r
    ));
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const addRule = () => {
    if (!newRule.name || !newRule.source || !newRule.destination) return;

    const rule: OrganizationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      source: newRule.source,
      destination: newRule.destination,
      fileTypes: newRule.fileTypes || [],
      condition: newRule.condition || 'extension',
      enabled: newRule.enabled || true
    };

    setRules(prev => [...prev, rule]);
    setNewRule({
      name: '',
      source: '',
      destination: '',
      fileTypes: [],
      condition: 'extension',
      enabled: true
    });
    setShowRuleModal(false);
  };

  const getStatusIcon = (status: OrganizationTask['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <div className="h-4 w-4 bg-red-500 rounded-full" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: OrganizationTask['status']) => {
    switch (status) {
      case 'running':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Automated File Organizer</h2>
        <p className="text-green-100">Set up rules to automatically organize your files</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {rules.filter(r => r.enabled).length}
              </p>
            </div>
            <Settings className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Running Tasks</p>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === 'running').length}
              </p>
            </div>
            <Play className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Files Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(rules.reduce((sum, r) => sum + (r.filesProcessed || 0), 0))}
              </p>
            </div>
            <FolderOpen className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">98.5%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Organization Rules */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Organization Rules</h3>
          <button
            onClick={() => setShowRuleModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Add Rule
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <h4 className="text-sm font-medium text-gray-900">{rule.name}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className="truncate max-w-xs">{rule.source}</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="truncate max-w-xs">{rule.destination}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                    <span>
                      Types: {rule.fileTypes.length > 0 ? rule.fileTypes.join(', ') : 'All'}
                    </span>
                    <span>
                      Condition: {rule.condition}
                    </span>
                    {rule.lastRun && (
                      <span>
                        Last run: {rule.lastRun.toLocaleDateString()}
                      </span>
                    )}
                    {rule.filesProcessed && (
                      <span>
                        Processed: {formatNumber(rule.filesProcessed)} files
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      rule.enabled 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => runRule(rule.id)}
                    disabled={!rule.enabled}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Recent Tasks
          </h3>
        </div>

        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Play className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p>No tasks have been run yet. Click "Run" on a rule to start organizing files.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {tasks.map((task) => (
              <div key={task.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.name}</p>
                      <p className="text-xs text-gray-500">
                        {task.filesProcessed} of {task.totalFiles} files processed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </p>
                    {task.startTime && (
                      <p className="text-xs text-gray-500">
                        {task.startTime.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {task.status === 'running' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(task.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Organize Documents"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Folder</label>
                <input
                  type="text"
                  value={newRule.source || ''}
                  onChange={(e) => setNewRule({ ...newRule, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., /Downloads"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Folder</label>
                <input
                  type="text"
                  value={newRule.destination || ''}
                  onChange={(e) => setNewRule({ ...newRule, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., /Documents/Organized"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Types (comma-separated)</label>
                <input
                  type="text"
                  value={newRule.fileTypes?.join(', ') || ''}
                  onChange={(e) => setNewRule({ 
                    ...newRule, 
                    fileTypes: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., pdf, docx, xlsx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={newRule.condition || 'extension'}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="extension">File Extension</option>
                  <option value="size">File Size</option>
                  <option value="age">File Age</option>
                  <option value="name">File Name</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRuleModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addRule}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileOrganizer;