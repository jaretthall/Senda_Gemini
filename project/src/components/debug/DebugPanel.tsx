'use client';

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { environmentChecker } from '@/lib/debug/environment-checker';
import { supabaseChecker } from '@/lib/debug/supabase-checker';
import { apiChecker } from '@/lib/debug/api-checker';

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState<any[]>([]);
  const [envChecks, setEnvChecks] = useState<any[]>([]);
  const [apiResults, setApiResults] = useState<any>({});
  const [supabaseStatus, setSupabaseStatus] = useState<any>({});

  useEffect(() => {
    // Update logs every second
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const runEnvironmentCheck = () => {
    logger.info('DEBUG_PANEL', 'Running environment check');
    const checks = environmentChecker.checkEnvironmentVariables();
    setEnvChecks(checks);
  };

  const runSupabaseCheck = async () => {
    logger.info('DEBUG_PANEL', 'Running Supabase check');
    const connectionOk = await supabaseChecker.checkConnection();
    const tables = await supabaseChecker.checkTables();
    const rlsOk = await supabaseChecker.checkRLS();
    
    setSupabaseStatus({
      connection: connectionOk,
      tables,
      rls: rlsOk
    });
  };

  const runApiCheck = async () => {
    logger.info('DEBUG_PANEL', 'Running API check');
    const results = await apiChecker.checkEndpoints();
    setApiResults(results);
  };

  const runAllChecks = async () => {
    logger.info('DEBUG_PANEL', 'Running all diagnostic checks');
    runEnvironmentCheck();
    await runSupabaseCheck();
    await runApiCheck();
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const exportLogs = () => {
    const logsJson = logger.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `senda-debug-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-danger-600 hover:bg-danger-700 text-white px-4 py-2 rounded-lg shadow-lg font-mono text-sm"
        >
          🐛 Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            🐛 Debug Panel
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={runAllChecks}
              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm"
            >
              Run All Checks
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-secondary-200 dark:border-secondary-700">
          {[
            { id: 'logs', label: 'Logs', count: logs.length },
            { id: 'environment', label: 'Environment', count: envChecks.filter(c => c.status !== 'ok').length },
            { id: 'supabase', label: 'Supabase', count: 0 },
            { id: 'api', label: 'API', count: Object.keys(apiResults).length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 bg-danger-100 text-danger-800 text-xs px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'logs' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Application Logs</h3>
                <div className="space-x-2">
                  <button
                    onClick={clearLogs}
                    className="bg-warning-600 hover:bg-warning-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Clear
                  </button>
                  <button
                    onClick={exportLogs}
                    className="bg-success-600 hover:bg-success-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="space-y-2 font-mono text-sm max-h-96 overflow-auto">
                {logs.slice(-50).reverse().map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border-l-4 ${
                      log.level === 0 ? 'border-secondary-400 bg-secondary-50 dark:bg-secondary-700' :
                      log.level === 1 ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' :
                      log.level === 2 ? 'border-warning-400 bg-warning-50 dark:bg-warning-900/20' :
                      'border-danger-400 bg-danger-50 dark:bg-danger-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold">[{log.category}] {log.message}</span>
                      <span className="text-xs text-secondary-500">{log.timestamp}</span>
                    </div>
                    {log.data && (
                      <pre className="mt-1 text-xs overflow-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                    {log.error && (
                      <div className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                        Error: {log.error.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'environment' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Environment Variables</h3>
                <button
                  onClick={runEnvironmentCheck}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm"
                >
                  Recheck
                </button>
              </div>
              <div className="space-y-2">
                {envChecks.map((check, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      check.status === 'ok' ? 'border-success-200 bg-success-50 dark:bg-success-900/20' :
                      check.status === 'missing' && check.required ? 'border-danger-200 bg-danger-50 dark:bg-danger-900/20' :
                      'border-warning-200 bg-warning-50 dark:bg-warning-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-semibold">{check.name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        check.status === 'ok' ? 'bg-success-100 text-success-800' :
                        check.status === 'missing' && check.required ? 'bg-danger-100 text-danger-800' :
                        'bg-warning-100 text-warning-800'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                      {check.message}
                    </div>
                    {check.value && (
                      <div className="text-xs font-mono text-secondary-500 mt-1">
                        Value: {check.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Supabase Status</h3>
                <button
                  onClick={runSupabaseCheck}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm"
                >
                  Recheck
                </button>
              </div>
              <div className="space-y-4">
                <div className={`p-3 rounded border ${
                  supabaseStatus.connection ? 'border-success-200 bg-success-50' : 'border-danger-200 bg-danger-50'
                }`}>
                  <h4 className="font-semibold">Connection Status</h4>
                  <p className={supabaseStatus.connection ? 'text-success-700' : 'text-danger-700'}>
                    {supabaseStatus.connection ? '✅ Connected' : '❌ Connection Failed'}
                  </p>
                </div>

                {supabaseStatus.tables && (
                  <div className="p-3 rounded border border-secondary-200 bg-secondary-50 dark:bg-secondary-700">
                    <h4 className="font-semibold mb-2">Database Tables</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(supabaseStatus.tables).map(([table, exists]) => (
                        <div key={table} className={`text-sm ${exists ? 'text-success-700' : 'text-danger-700'}`}>
                          {exists ? '✅' : '❌'} {table}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">API Endpoints</h3>
                <button
                  onClick={runApiCheck}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm"
                >
                  Recheck
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(apiResults).map(([endpoint, result]: [string, any]) => (
                  <div
                    key={endpoint}
                    className={`p-3 rounded border ${
                      result.ok ? 'border-success-200 bg-success-50 dark:bg-success-900/20' :
                      result.error ? 'border-danger-200 bg-danger-50 dark:bg-danger-900/20' :
                      'border-warning-200 bg-warning-50 dark:bg-warning-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-semibold">{endpoint}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        result.ok ? 'bg-success-100 text-success-800' :
                        result.error ? 'bg-danger-100 text-danger-800' :
                        'bg-warning-100 text-warning-800'
                      }`}>
                        {result.status || 'ERROR'}
                      </span>
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                      {result.description}
                    </div>
                    {result.error && (
                      <div className="text-xs text-danger-600 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;