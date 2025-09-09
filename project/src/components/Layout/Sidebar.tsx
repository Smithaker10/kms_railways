import React from 'react';
import { 
  Home, 
  Search, 
  FileText, 
  Share2, 
  Bell, 
  Settings, 
  Shield, 
  Wrench, 
  Building, 
  TrendingUp,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const { user } = useAuth();

  const getMenuItems = (role: string) => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'search', label: 'Search', icon: Search },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Share2 },
      { id: 'upload', label: 'Upload Documents', icon: Upload },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const roleSpecificItems = {
      maintenance_engineer: [
        { id: 'maintenance', label: 'Maintenance', icon: Wrench }
      ],
      station_controller: [
        { id: 'operations', label: 'Operations', icon: Building }
      ],
      compliance_officer: [
        { id: 'compliance', label: 'Compliance', icon: Shield }
      ],
      executive: [
        { id: 'analytics', label: 'Analytics', icon: TrendingUp }
      ]
    };

    return [
      ...baseItems,
      ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || []),
      { id: 'settings', label: 'Settings', icon: Settings }
    ];
  };

  const menuItems = getMenuItems(user?.role || '');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;