import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users,
  Wrench,
  Building,
  Shield,
  BarChart3
} from 'lucide-react';

const DashboardView: React.FC = () => {
  const { user } = useAuth();

  const getStatsCards = (role: string) => {
    const baseStats = [
      {
        title: 'Total Documents',
        value: '1,247',
        change: '+12%',
        icon: FileText,
        color: 'blue'
      },
      {
        title: 'Pending Reviews',
        value: '23',
        change: '-8%',
        icon: Clock,
        color: 'yellow'
      }
    ];

    const roleSpecificStats = {
      maintenance_engineer: [
        {
          title: 'Active Maintenance Tasks',
          value: '15',
          change: '+5%',
          icon: Wrench,
          color: 'green'
        },
        {
          title: 'Equipment Alerts',
          value: '3',
          change: 'New',
          icon: AlertTriangle,
          color: 'red'
        }
      ],
      station_controller: [
        {
          title: 'Station Status',
          value: '98.5%',
          change: '+0.2%',
          icon: Building,
          color: 'green'
        },
        {
          title: 'Active Incidents',
          value: '2',
          change: 'Stable',
          icon: AlertTriangle,
          color: 'orange'
        }
      ],
      compliance_officer: [
        {
          title: 'Compliance Score',
          value: '94%',
          change: '+2%',
          icon: Shield,
          color: 'green'
        },
        {
          title: 'Audit Items',
          value: '8',
          change: 'Due',
          icon: CheckCircle,
          color: 'blue'
        }
      ],
      executive: [
        {
          title: 'System Efficiency',
          value: '96.2%',
          change: '+1.5%',
          icon: TrendingUp,
          color: 'green'
        },
        {
          title: 'Team Performance',
          value: '92%',
          change: '+3%',
          icon: Users,
          color: 'blue'
        }
      ]
    };

    return [
      ...baseStats,
      ...(roleSpecificStats[role as keyof typeof roleSpecificStats] || [])
    ];
  };

  const getRecentActivities = (role: string) => {
    const activities = {
      maintenance_engineer: [
        { type: 'maintenance', message: 'Scheduled maintenance for Line 2 completed', time: '2 hours ago' },
        { type: 'alert', message: 'New equipment alert: Escalator E-23', time: '4 hours ago' },
        { type: 'document', message: 'Updated SOP for track inspection', time: '1 day ago' }
      ],
      station_controller: [
        { type: 'incident', message: 'Minor delay resolved on Line 1', time: '1 hour ago' },
        { type: 'status', message: 'All stations operational', time: '3 hours ago' },
        { type: 'document', message: 'Emergency procedures manual updated', time: '2 days ago' }
      ],
      compliance_officer: [
        { type: 'audit', message: 'Safety audit completed for Central Station', time: '3 hours ago' },
        { type: 'compliance', message: 'Monthly compliance report generated', time: '6 hours ago' },
        { type: 'document', message: 'New safety protocol approved', time: '1 day ago' }
      ],
      executive: [
        { type: 'report', message: 'Weekly performance report available', time: '2 hours ago' },
        { type: 'meeting', message: 'Board meeting scheduled for next week', time: '5 hours ago' },
        { type: 'metric', message: 'KPI targets exceeded this quarter', time: '1 day ago' }
      ]
    };

    return activities[role as keyof typeof activities] || activities.maintenance_engineer;
  };

  const statsCards = getStatsCards(user?.role || '');
  const recentActivities = getRecentActivities(user?.role || '');

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getRoleName = (role: string) => {
    const roleNames = {
      'maintenance_engineer': 'Maintenance Engineer',
      'station_controller': 'Station Controller',
      'compliance_officer': 'Compliance Officer',
      'executive': 'Executive'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600">
          {getRoleName(user?.role || '')} Dashboard - Metro Rail Operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg border ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.startsWith('-') ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Search Documents</p>
              <p className="text-sm text-gray-600">Find procedures & SOPs</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
              <p className="font-medium text-gray-900">Report Incident</p>
              <p className="text-sm text-gray-600">Submit incident report</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">View Checklists</p>
              <p className="text-sm text-gray-600">Access daily checklists</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-sm text-gray-600">Generate reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;