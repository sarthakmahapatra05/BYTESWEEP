import React, { useState, useEffect } from 'react';
import { FolderOpen, ArrowRight, Settings, Play, CheckCircle, Clock, Zap } from 'lucide-react';
import { formatBytes, formatNumber } from '../utils/mockData';

const FileOrganizer = () => {
  const [rules, setRules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    source: '',
    destination: '',
    fileTypes: [],
    condition: 'extension',
    enabled: true
  });

  useEffect(() => {
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

  const runRule = (ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    const task = {
      id: Date.now().toString(),
      name: rule.name,
      status: 'running',
      progress: 0,
      filesProcessed: 0,
      totalFiles: Math.floor(Math.random() * 100) + 10,
      startTime: new Date()
    };
    setTasks(prev => [task, ...prev]);
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
    setRules(prev => prev.map(r =>
      r.id === ruleId
        ? { ...r, lastRun: new Date(), filesProcessed: (r.filesProcessed || 0) + task.totalFiles }
        : r
    ));
  };

  const toggleRule = (ruleId) => {
    setRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteRule = (ruleId) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const addRule = () => {
    if (!newRule.name || !newRule.source || !newRule.destination) return;
    const rule = {
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

  const getStatusIcon = (status) => {
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

  const getStatusColor = (status) => {
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
        {/* Rest of the component code */}
      </div>
    </div>
  );
};

export default FileOrganizer; 