import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User, FileText, Home, CheckSquare, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import NotificationsMenu from './NotificationsMenu';

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['user', 'manager', 'admin'] },
    { name: 'My Requisitions', href: '/requisitions', icon: FileText, roles: ['user', 'manager', 'admin'] },
    { name: 'New Requisition', href: '/requisitions/new', icon: FileText, roles: ['user', 'manager', 'admin'] },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare, roles: ['manager', 'admin'] },
    { name: 'Admin Dashboard', href: '/admin', icon: Users, roles: ['admin'] },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-30 h-screen w-64 bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold">AM</span>
            </div>
            <span className="text-lg font-semibold">Asset Manager</span>
          </div>
          <button 
            className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredNavItems.map(item => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100 hover:text-primary-700"
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                <User size={20} className="text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex w-full items-center justify-center space-x-2 rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-4">
            <button 
              className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 relative"
                  onClick={toggleNotifications}
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500"></span>
                </button>
                {notificationsOpen && (
                  <NotificationsMenu onClose={() => setNotificationsOpen(false)} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t text-center text-sm text-neutral-500">
          <p>© 2025 Office Asset Management. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}