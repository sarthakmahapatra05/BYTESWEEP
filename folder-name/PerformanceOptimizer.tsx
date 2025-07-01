import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Shield, Database, Cpu, MemoryStick as Memory, CheckCircle, AlertTriangle, Play, Loader } from 'lucide-react';
import { formatBytes, formatNumber } from '../utils/mockData';

interface OptimizationTask {
  id: string;
  name: string;
  description: string;
  category: 'cleanup' | 'registry' | 'startup' | 'services' | 'memory';
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  spaceFreed?: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  startupPrograms: number;
  backgroundServices: number;
  registryIssues: number;
  junkFiles: number;
  junkSize: number;
}

const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 78,
    startupPrograms: 23,
    backgroundServices: 156,
    registryIssues: 89,
    junkFiles: 3247,
    junkSize: 8500000000
  });

  const [tasks, setTasks] = useState<OptimizationTask[]>([
    {
      id: '1',
      name: 'Clean Temporary Files',
      description: 'Remove temporary files, cache, and system logs',
      category: 'cleanup',
      impact: 'high',
      status: 'pending',
      progress: 0,
      estimatedTime: 120,
      spaceFreed: 0
    },
    {
      id: '2',
      name: 'Optimize Registry',
      description: 'Clean invalid registry entries and optimize database',
      category: 'registry',
      impact: 'medium',
      status: 'pending',
      progress: 0,
      estimatedTime: 180
    },
    {
      id: '3',
      name: 'Manage Startup Programs',
      description: 'Disable unnecessary startup programs',
      category: 'startup',
      impact: 'high',
      status: 'pending',
      progress: 0,
      estimatedTime: 90
    },
    {
      id: '4',
      name: 'Optimize Services',
      description: 'Disable unnecessary background services',
      category: 'services',
      impact: 'medium',
      status: 'pending',
      progress: 0,
      estimatedTime: 150
    },
    {
      id: '5',
      name: 'Memory Optimization',
      description: 'Clear memory cache and optimize RAM usage',
      category: 'memory',
      impact: 'low',
      status: 'pending',
      progress: 0,
      estimatedTime: 60
    }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runOptimization = (taskId?: string) => {
    const tasksToRun = taskId ? tasks.filter(t => t.id === taskId) : tasks;
    setIsOptimizing(true);

    tasksToRun.forEach((task, index) => {
      setTimeout(() => {
        setTasks(prev => prev.map(t => 
          t.id === task.id ? { ...t, status: 'running' } : t
        ));

        // Simulate progress
        const progressInterval = setInterval(() => {
          setTasks(prev => prev.map(t => {
            if (t.id === task.id && t.status === 'running') {
              const newProgress = Math.min(t.progress + Math.random() * 20, 100);
              
              if (newProgress >= 100) {
                clearInterval(progressInterval);
                
                // Update metrics based on task completion
                if (task.category === 'cleanup') {
                  setMetrics(m => ({ ...m, junkFiles: Math.max(0, m.junkFiles - 500) }));
                }
                
                return {
                  ...t,
                  status: 'completed',
                  progress: 100,
                  spaceFreed: task.category === 'cleanup' ? Math.random() * 2000000000 : undefined
                };
              }
              
              return { ...t, progress: newProgress };
            }
            return t;
          }));
        }, 500);
      }, index * 1000);
    });

    // Complete optimization after all tasks
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationResults({
        tasksCompleted: tasksToRun.length,
        spaceFreed: tasksToRun.reduce((sum, t) => sum + (Math.random() * 1000000000), 0),
        performanceGain: Math.random() * 30 + 10
      });
    }, tasksToRun.length * 1000 + 3000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleanup':
        return <Database className="h-4 w-4" />;
      case 'registry':
        return <Shield className="h-4 w-4" />;
      case 'startup':
        return <Play className="h-4 w-4" />;
      case 'services':
        return <Cpu className="h-4 w-4" />;
      case 'memory':
        return <Memory className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage > 80) return 'text-red-600';
    if (usage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageBarColor = (usage: number) => {
    if (usage > 80) return 'bg-red-500';
    if (usage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">System Performance Optimizer</h2>
        <p className="text-purple-100">Boost your system's performance with automated optimizations</p>
      </div>

      {/* Optimization Results */}
      {optimizationResults && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-green-800">Optimization Complete!</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{optimizationResults.tasksCompleted}</p>
              <p className="text-sm text-green-700">Tasks Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatBytes(optimizationResults.spaceFreed)}</p>
              <p className="text-sm text-green-700">Space Freed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{Math.round(optimizationResults.performanceGain)}%</p>
              <p className="text-sm text-green-700">Performance Gain</p>
            </div>
          </div>
        </div>
      )}

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">CPU Usage</span>
            </div>
            <span className={`text-lg font-bold ${getUsageColor(metrics.cpuUsage)}`}>
              {metrics.cpuUsage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsageBarColor(metrics.cpuUsage)}`}
              style={{ width: `${metrics.cpuUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Memory className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Memory Usage</span>
            </div>
            <span className={`text-lg font-bold ${getUsageColor(metrics.memoryUsage)}`}>
              {metrics.memoryUsage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsageBarColor(metrics.memoryUsage)}`}
              style={{ width: `${metrics.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Junk Files</p>
              <p className="text-2xl font-bold text-orange-600">{formatNumber(metrics.junkFiles)}</p>
            </div>
            <Database className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">{formatBytes(metrics.junkSize)}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registry Issues</p>
              <p className="text-2xl font-bold text-red-600">{formatNumber(metrics.registryIssues)}</p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Needs attention</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Optimization</h3>
            <p className="text-gray-600">Run all optimization tasks automatically</p>
          </div>
          <button
            onClick={() => runOptimization()}
            disabled={isOptimizing}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isOptimizing ? (
              <Loader className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <TrendingUp className="h-5 w-5 mr-2" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
          </button>
        </div>
      </div>

      {/* Optimization Tasks */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Optimization Tasks</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(task.status)}
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(task.category)}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{task.name}</h4>
                      <p className="text-xs text-gray-500">{task.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getImpactColor(task.impact)}`}>
                      {task.impact.toUpperCase()} IMPACT
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      ~{task.estimatedTime}s
                    </p>
                  </div>
                  
                  <button
                    onClick={() => runOptimization(task.id)}
                    disabled={task.status === 'running' || task.status === 'completed' || isOptimizing}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {task.status === 'completed' ? 'Done' : task.status === 'running' ? 'Running' : 'Run'}
                  </button>
                </div>
              </div>
              
              {task.status === 'running' && (
                <div className="mt-3">
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
              
              {task.status === 'completed' && task.spaceFreed && (
                <div className="mt-2 text-xs text-green-600">
                  ✓ Freed {formatBytes(task.spaceFreed)} of disk space
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          Performance Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Regular Maintenance</p>
                <p className="text-sm text-gray-600">Run optimization weekly for best performance</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Monitor Startup Programs</p>
                <p className="text-sm text-gray-600">Disable unnecessary programs that start with Windows</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Keep Software Updated</p>
                <p className="text-sm text-gray-600">Updated software often includes performance improvements</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Free Up Disk Space</p>
                <p className="text-sm text-gray-600">Keep at least 20% of your disk space free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizer;