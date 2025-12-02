import React, { useState, useEffect } from 'react';
import { api } from './services/mockStore';
import { User, UserRole } from './types';
import { 
  Menu, X, User as UserIcon, LogOut, Settings, HelpCircle, 
  Home as HomeIcon, Briefcase, Lightbulb, DollarSign 
} from 'lucide-react';
import AuthFlow from './components/AuthFlow';
import HomeFeed from './components/HomeFeed';
import ProjectDashboard from './components/ProjectDashboard';
import InsightsDashboard from './components/InsightsDashboard';
import FundingDashboard from './components/FundingDashboard';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import { AboutView, PrivacyView, TermsView } from './components/StaticPages';

// Simple router states
type View = 'auth' | 'home' | 'projects' | 'insights' | 'funding' | 'profile' | 'settings' | 'about' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('auth');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = api.users.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setCurrentView('home');
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    api.users.setCurrentUser(u.id);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    api.users.setCurrentUser(null);
    setCurrentView('auth');
    setIsProfileMenuOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    api.users.setCurrentUser(updatedUser.id);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === view 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  if (!user || currentView === 'auth') {
    return <AuthFlow onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl text-gray-800 tracking-tight">Ponsectors</span>
              </div>
              
              {/* Desktop Nav */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4 sm:items-center">
                <NavItem view="home" icon={HomeIcon} label="Home" />
                <NavItem view="projects" icon={Briefcase} label="Projects" />
                <NavItem view="insights" icon={Lightbulb} label="Insights" />
                <NavItem view="funding" icon={DollarSign} label="Funding" />
              </div>
            </div>

            {/* Right Side: Profile & Mobile Toggle */}
            <div className="flex items-center">
              {/* Profile Dropdown */}
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                       {user.name.charAt(0)}
                    </div>
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <button
                      onClick={() => { setCurrentView('profile'); setIsProfileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center"><UserIcon className="w-4 h-4 mr-2" /> View Profile</div>
                    </button>
                    <button 
                      onClick={() => { setCurrentView('settings'); setIsProfileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center"><Settings className="w-4 h-4 mr-2" /> Settings</div>
                    </button>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center"><HelpCircle className="w-4 h-4 mr-2" /> Help</div>
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center"><LogOut className="w-4 h-4 mr-2" /> Log out</div>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden ml-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-gray-200">
            <div className="pt-2 pb-3 space-y-1 px-2">
              <NavItem view="home" icon={HomeIcon} label="Home" />
              <NavItem view="projects" icon={Briefcase} label="Projects" />
              <NavItem view="insights" icon={Lightbulb} label="Insights" />
              <NavItem view="funding" icon={DollarSign} label="Funding" />
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <HomeFeed user={user} onViewProject={() => setCurrentView('projects')} />}
        {currentView === 'projects' && <ProjectDashboard user={user} />}
        {currentView === 'insights' && <InsightsDashboard user={user} />}
        {currentView === 'funding' && <FundingDashboard user={user} />}
        {currentView === 'profile' && <ProfileView user={user} />}
        {currentView === 'settings' && <SettingsView user={user} onUpdateUser={handleUpdateUser} />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'privacy' && <PrivacyView />}
        {currentView === 'terms' && <TermsView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 Ponsectors. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button onClick={() => setCurrentView('about')} className="text-gray-400 hover:text-gray-500 text-sm">About</button>
            <button onClick={() => setCurrentView('privacy')} className="text-gray-400 hover:text-gray-500 text-sm">Privacy Policy</button>
            <button onClick={() => setCurrentView('terms')} className="text-gray-400 hover:text-gray-500 text-sm">Terms of Use</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
