import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import DashboardView from './components/Dashboard/DashboardView';
import SearchView from './components/Search/SearchView';
import DocumentsView from './components/Documents/DocumentsView';
import KnowledgeGraphView from './components/KnowledgeGraph/KnowledgeGraphView';
import UploadView from './components/Upload/UploadView';
import NotificationView from './components/Notifications/NotificationView';
import LoginView from './components/Auth/LoginView';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);

  const handleSearch = (query: string) => {
    setCurrentView('search');
    // The SearchView component would handle the actual search logic
  };

  const handleNotificationClick = () => {
    setCurrentView('notifications');
    setNotificationCount(0); // Clear notification count when viewed
  };

  const handleUploadClick = () => {
    setCurrentView('upload');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'search':
        return <SearchView />;
      case 'documents':
        return <DocumentsView />;
      case 'knowledge-graph':
        return <KnowledgeGraphView />;
      case 'upload':
        return <UploadView />;
      case 'notifications':
        return <NotificationView />;
      case 'maintenance':
      case 'operations':
      case 'compliance':
      case 'analytics':
      case 'settings':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
              </h2>
              <p className="text-gray-600">This section is under development</p>
            </div>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        onToggleMode={() => setIsSignUp(!isSignUp)}
        isSignUp={isSignUp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onNotificationClick={handleNotificationClick}
          onSearchSubmit={handleSearch}
          onUploadClick={handleUploadClick}
          notificationCount={notificationCount}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;