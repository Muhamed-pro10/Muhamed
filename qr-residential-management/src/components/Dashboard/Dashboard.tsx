import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  TrendingUp,
  Building,
  Shield
} from 'lucide-react';
import { getDashboardStats, getAccessLogs } from '../../utils/dataService';
import { DashboardStats, AccessLog } from '../../types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    const loadDashboardData = () => {
      const dashboardStats = getDashboardStats();
      const logs = getAccessLogs(10);
      
      setStats(dashboardStats);
      setRecentLogs(logs);
    };

    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'primary' 
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    trend?: string;
    color?: 'primary' | 'green' | 'blue' | 'orange';
  }) => {
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-600',
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      orange: 'bg-orange-50 text-orange-600',
    };

    return (
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  const AccessLogItem = ({ log }: { log: AccessLog }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${
          log.accessType === 'entry' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-orange-100 text-orange-600'
        }`}>
          {log.accessType === 'entry' ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownLeft className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{log.residentName}</p>
          <p className="text-xs text-gray-500">Unit {log.unitNumber}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-900 capitalize">{log.accessType}</p>
        <p className="text-xs text-gray-500">
          {format(new Date(log.timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening at your residential compound.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Residents"
          value={stats.totalResidents}
          icon={Users}
          trend="+2 this month"
          color="primary"
        />
        <StatCard
          title="Active Residents"
          value={stats.activeResidents}
          icon={UserCheck}
          trend="98% active"
          color="green"
        />
        <StatCard
          title="Today's Entries"
          value={stats.todayEntries}
          icon={ArrowUpRight}
          trend="+5% vs yesterday"
          color="blue"
        />
        <StatCard
          title="Today's Exits"
          value={stats.todayExits}
          icon={ArrowDownLeft}
          trend="Normal flow"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              {recentLogs.length > 0 ? (
                <div className="space-y-1">
                  {recentLogs.slice(0, 8).map((log) => (
                    <AccessLogItem key={log.id} log={log} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn btn-primary text-left">
                  <UserCheck className="h-5 w-5 mr-3" />
                  Add New Resident
                </button>
                <button className="w-full btn btn-secondary text-left">
                  <Shield className="h-5 w-5 mr-3" />
                  Open QR Scanner
                </button>
                <button className="w-full btn btn-secondary text-left">
                  <Building className="h-5 w-5 mr-3" />
                  View All Buildings
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">QR System</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Security</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Peak Entry Time:</span>
                  <span className="font-medium text-gray-900 ml-2">8:00 AM</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Peak Exit Time:</span>
                  <span className="font-medium text-gray-900 ml-2">5:30 PM</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Most Active Building:</span>
                  <span className="font-medium text-gray-900 ml-2">Building A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;