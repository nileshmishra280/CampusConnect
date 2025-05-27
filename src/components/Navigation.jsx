import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Navigation = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Note: In production, use localStorage.getItem('darkMode') === 'true'
    return false; // Using false as default since localStorage isn't available in artifacts
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New placement drive scheduled!', time: '2h ago', unread: true },
    { id: 2, message: 'Application deadline approaching.', time: '1d ago', unread: false },
  ]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Define valid roles
  const validRoles = ['student', 'admin', 'coordinator', 'company'];

  // Validate role prop
  if (!role || !validRoles.includes(role)) {
    console.error(`Invalid role: ${role}. Role must be one of: ${validRoles.join(', ')}. Falling back to 'student' role.`);
    role = 'student'; // Fallback to a default role
  }

  // Role-based sidebar items with Remix Icons
  const defaultNavItems = {
    student: [
      { name: 'Dashboard', href: '/student/dashboard', icon: 'ri-dashboard-line', subItems: [] },
      { name: 'Applications', href: '/student/applications', icon: 'ri-file-text-line', subItems: [
        { name: 'Pending', href: '/student/applications/pending' },
        { name: 'Submitted', href: '/student/applications/submitted' },
        { name: 'History', href: '/student/applications/history' },
      ]},
      { name: 'Resume Builder', href: '/student/resume', icon: 'ri-file-user-line', subItems: [] },
      { name: 'Placement Form', href: '/student/placement-form', icon: 'ri-clipboard-line', subItems: [] },
      { name: 'Job Applications', href: '/student/apply-jobs', icon: 'ri-briefcase-line', subItems: [
        { name: 'Browse Jobs', href: '/student/apply-jobs/browse' },
        { name: 'Saved Jobs', href: '/student/apply-jobs/saved' },
        { name: 'Applied Jobs', href: '/student/apply-jobs/applied' },
      ]},
      { name: 'Certificates', href: '/student/certificates', icon: 'ri-award-line', subItems: [] },
      { name: 'Internship Tracker', href: '/student/internships', icon: 'ri-global-line', subItems: [] },
      { name: 'Study Materials', href: '/student/study-materials', icon: 'ri-book-open-line', subItems: [] },
      { name: 'Feedback', href: '/student/feedback', icon: 'ri-chat-1-line', subItems: [] },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: 'ri-dashboard-line', subItems: [] },
      { name: 'Users', href: '/admin/users', icon: 'ri-group-line', subItems: [
        { name: 'Students', href: '/admin/users/students' },
        { name: 'Coordinators', href: '/admin/users/coordinators' },
        { name: 'Companies', href: '/admin/users/companies' },
      ]},
      { name: 'Analytics', href: '/admin/analytics', icon: 'ri-line-chart-line', subItems: [
        { name: 'Placement Stats', href: '/admin/analytics/placements' },
        { name: 'User Activity', href: '/admin/analytics/activity' },
        { name: 'Reports', href: '/admin/analytics/reports' },
      ]},
      { name: 'Placements', href: '/admin/placements', icon: 'ri-building-line', subItems: [
        { name: 'Manage Drives', href: '/admin/placements/drives' },
        { name: 'Applications', href: '/admin/placements/applications' },
      ]},
      { name: 'Settings', href: '/admin/settings', icon: 'ri-settings-3-line', subItems: [
        { name: 'System Config', href: '/admin/settings/system' },
        { name: 'User Roles', href: '/admin/settings/roles' },
      ]},
    ],
    coordinator: [
      { name: 'Dashboard', href: '/coordinator/dashboard', icon: 'ri-dashboard-line', subItems: [] },
      { name: 'Placements', href: '/coordinator/placements', icon: 'ri-building-line', subItems: [
        { name: 'Upcoming Drives', href: '/coordinator/placements/upcoming' },
        { name: 'Past Drives', href: '/coordinator/placements/past' },
        { name: 'Applications', href: '/coordinator/placements/applications' },
      ]},
      { name: 'Companies', href: '/coordinator/companies', icon: 'ri-community-line', subItems: [
        { name: 'Add Company', href: '/coordinator/companies/add' },
        { name: 'Manage Companies', href: '/coordinator/companies/manage' },
      ]},
      { name: 'Schedule', href: '/coordinator/schedule', icon: 'ri-calendar-event-line', subItems: [
        { name: 'Create Event', href: '/coordinator/schedule/create' },
        { name: 'View Calendar', href: '/coordinator/schedule/calendar' },
      ]},
      { name: 'Reports', href: '/coordinator/reports', icon: 'ri-file-chart-line', subItems: [] },
    ],
    company: [
      { name: 'Dashboard', href: '/company/dashboard', icon: 'ri-dashboard-line', subItems: [] },
      { name: 'Job Postings', href: '/company/jobs', icon: 'ri-briefcase-2-line', subItems: [
        { name: 'Create Job', href: '/company/jobs/create' },
        { name: 'Active Jobs', href: '/company/jobs/active' },
        { name: 'Closed Jobs', href: '/company/jobs/closed' },
      ]},
      { name: 'Applications', href: '/company/applications', icon: 'ri-file-list-2-line', subItems: [
        { name: 'Review Applications', href: '/company/applications/review' },
        { name: 'Shortlisted', href: '/company/applications/shortlisted' },
        { name: 'Rejected', href: '/company/applications/rejected' },
      ]},
      { name: 'Interviews', href: '/company/interviews', icon: 'ri-user-voice-line', subItems: [
        { name: 'Schedule Interview', href: '/company/interviews/schedule' },
        { name: 'Upcoming Interviews', href: '/company/interviews/upcoming' },
        { name: 'Past Interviews', href: '/company/interviews/past' },
      ]},
      { name: 'Analytics', href: '/company/analytics', icon: 'ri-bar-chart-line', subItems: [] },
      { name: 'Company Profile', href: '/company/profile', icon: 'ri-building-2-line', subItems: [] },
    ],
  };

  const [navItems, setNavItems] = useState(() => {
    // Note: In production, use localStorage.getItem(`navItems_${role}`)
    return defaultNavItems[role];
  });

  useEffect(() => {
    // Note: In production, use localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Note: In production, use localStorage.setItem(`navItems_${role}`, JSON.stringify(navItems))
  }, [navItems, role]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('text/plain');
    const items = [...navItems];
    const [draggedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    setNavItems(items);
  };

  const handleResize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const filteredNavItems = navItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subItems.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const breadcrumbs = location.pathname.split('/').filter(Boolean).map((part, index, arr) => {
    const path = `/${arr.slice(0, index + 1).join('/')}`;
    return { name: part.charAt(0).toUpperCase() + part.slice(1), href: path };
  });

  return (
    <>
      {/* Remix Icons CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.css"
        rel="stylesheet"
      />
      
      <div className={`flex min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        {/* Sidebar */}
        <aside
          className={`fixed top-0 bottom-0 z-40 bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 shadow-xl ${
            isSidebarOpen ? '' : 'w-16'
          } lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '4rem' }}
        >
          <div className="flex flex-col h-full">
            {/* Logo and Toggle */}
            <div className="flex items-center p-4 border-b border-blue-500/30">
              {isSidebarOpen ? (
                <Link to="/" className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white text-blue-600 rounded-lg flex items-center justify-center">
                    <i className="ri-graduation-cap-line text-lg"></i>
                  </div>
                  <span className="text-xl font-bold">CampusConnect</span>
                </Link>
              ) : (
                <div className="h-8 w-8 bg-white text-blue-600 rounded-lg flex items-center justify-center mx-auto">
                  <i className="ri-graduation-cap-line text-lg"></i>
                </div>
              )}
              <button
                className="ml-auto lg:block hidden p-1 hover:bg-blue-500/30 rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <i className={`ri-${isSidebarOpen ? 'menu-fold' : 'menu-unfold'}-line text-xl`}></i>
              </button>
            </div>

            {/* Search Bar */}
            {isSidebarOpen && (
              <div className="px-4 py-3">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"></i>
                  <input
                    type="text"
                    placeholder="Search navigation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-500/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-blue-500/50"
                  />
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-blue-600 scrollbar-thumb-blue-400 hover:scrollbar-thumb-blue-300">
              <ul className="p-4 space-y-1">
                {filteredNavItems.map((item, index) => (
                  <li
                    key={item.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    className="group relative"
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-200 ${
                        location.pathname === item.href ? 'bg-blue-500/50 shadow-lg' : ''
                      }`}
                    >
                      <i className={`${item.icon} text-xl flex-shrink-0`}></i>
                      {isSidebarOpen && (
                        <>
                          <span className="flex-1 font-medium">{item.name}</span>
                          {item.subItems.length > 0 && (
                            <i className="ri-arrow-down-s-line text-lg transform transition-transform duration-300 group-hover:rotate-180"></i>
                          )}
                        </>
                      )}
                    </Link>
                    
                    {/* Sub Items */}
                    {isSidebarOpen && item.subItems.length > 0 && (
                      <ul className="ml-8 mt-1 space-y-1 hidden group-hover:block animate-fadeIn">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.href}
                              className={`block p-2 rounded-lg hover:bg-blue-400/30 transition-colors text-sm ${
                                location.pathname === subItem.href ? 'bg-blue-400/50 text-white' : 'text-blue-100'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Tooltip for collapsed sidebar */}
                    {!isSidebarOpen && (
                      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        {item.name}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quick Access Toolbar */}
            {isSidebarOpen && (
              <div className="p-4 border-t border-blue-500/30">
                <h3 className="text-sm font-semibold mb-3 text-blue-100">Quick Access</h3>
                <div className="flex gap-2">
                  <button className="flex-1 p-2 bg-blue-500/30 rounded-lg hover:bg-blue-400/40 transition-colors" title="Add New">
                    <i className="ri-add-line text-lg"></i>
                  </button>
                  <button className="flex-1 p-2 bg-blue-500/30 rounded-lg hover:bg-blue-400/40 transition-colors" title="Refresh">
                    <i className="ri-refresh-line text-lg"></i>
                  </button>
                  <button className="flex-1 p-2 bg-blue-500/30 rounded-lg hover:bg-blue-400/40 transition-colors" title="Help">
                    <i className="ri-question-line text-lg"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resize Handle */}
          {isSidebarOpen && (
            <div
              className="absolute top-0 right-0 w-1 h-full bg-blue-400/50 cursor-col-resize hover:bg-blue-300 transition-colors"
              onMouseDown={() => setIsResizing(true)}
            />
          )}
        </aside>

        {/* Mobile Toggle */}
        <button
          className={`fixed top-4 left-4 z-50 lg:hidden h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 ${
            isSidebarOpen ? 'rotate-180' : ''
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-expanded={isSidebarOpen}
          aria-label="Toggle sidebar"
        >
          <i className={`ri-${isSidebarOpen ? 'close' : 'menu'}-line text-xl`}></i>
        </button>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
          }`}
          onMouseMove={handleResize}
          onMouseUp={() => setIsResizing(false)}
          style={{ marginLeft: isSidebarOpen ? `${sidebarWidth}px` : '4rem' }}
        >
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                  </h1>
                  {/* Breadcrumbs */}
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {breadcrumbs.map((crumb, index) => (
                      <div key={crumb.href} className="flex items-center">
                        <Link to={crumb.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {crumb.name}
                        </Link>
                        {index < breadcrumbs.length - 1 && (
                          <i className="ri-arrow-right-s-line mx-1"></i>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Notifications"
                  >
                    <i className="ri-notification-3-line text-xl text-gray-600 dark:text-gray-300"></i>
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                          <i className="ri-settings-3-line text-gray-500 hover:text-gray-700 cursor-pointer"></i>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  <i className={`ri-${darkMode ? 'sun' : 'moon'}-line text-xl text-gray-600 dark:text-gray-300`}></i>
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Profile menu"
                  >
                    <div className="text-right hidden sm:block">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 block">Mishra Nilesh</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{role}</span>
                    </div>
                    <img
                      src="https://i.pravatar.cc/40?img=35"
                      alt="User avatar"
                      className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <i className="ri-arrow-down-s-line text-gray-500"></i>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <i className="ri-user-line"></i>
                        Profile
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <i className="ri-settings-3-line"></i>
                        Settings
                      </Link>
                      <hr className="border-gray-200 dark:border-gray-700" />
                      <button className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <i className="ri-logout-box-line"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Mobile Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-track-blue-600 {
          scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </>
  );
};

export default Navigation;