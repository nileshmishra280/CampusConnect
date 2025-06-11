import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Navigation = ({ role }) => {
  const { user,logout } = useAuth();
  const navigate=useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize darkMode from localStorage, default to false (light mode) if not set
    return localStorage.getItem('theme') === 'dark';
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New placement drive scheduled!', time: '2h ago', unread: true },
    { id: 2, message: 'Application deadline approaching.', time: '1d ago', unread: false },
  ]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Define valid roles
  const validRoles = ['student', 'admin', 'company'];

  // Validate role prop
  if (!role || !validRoles.includes(role)) {
    console.error(`Invalid role: ${role}. Role must be one of: ${validRoles.join(', ')}. Falling back to 'student' role.`);
    role = 'student';
  }

  const handleLogOut=()=>{
    logout();
    navigate('/');
  }

  // Role-based sidebar items with Remix Icons
  const defaultNavItems = {
    student: [
      { name: 'Dashboard', href: '/student/dashboard', icon: 'ri-dashboard-line', subItems: [] },
      {
        name: 'Applications', href: '/student/applications', icon: 'ri-file-text-line', subItems: [
          
        ]
      },
      { name: 'Interview Questions', href: '/student/resumeQuestions', icon: 'ri-file-user-line', subItems: [] },
      { name: 'Placement Form', href: '/student/placement-form', icon: 'ri-clipboard-line', subItems: [] },
      {
        name: 'Job Applications', icon: 'ri-briefcase-line', subItems: [
          { name: 'Browse Jobs', href: '/student/apply-jobs/browse' },
          { name: 'Applied Jobs', href: '/student/apply-jobs/applied' },
        ]
      },
      { name: 'Certificates', href: '/student/certificates', icon: 'ri-award-line', subItems: [] },
      { name: 'Internship Tracker', href: '/student/internships', icon: 'ri-global-line', subItems: [] },
      { name: 'Study Materials', href: '/student/study-materials', icon: 'ri-book-open-line', subItems: [] },
      { name: 'Feedback', href: '/student/feedback', icon: 'ri-chat-1-line', subItems: [] },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: 'ri-dashboard-line', subItems: [] },
      {
        name: 'Users', href: '/admin/users', icon: 'ri-group-line', subItems: [
          { name: 'Students', href: '/admin/users/students' },
          { name: 'Companies', href: '/admin/users/companies' },
        ]
      },
      {
        name: 'Analytics', href: '/admin/analytics', icon: 'ri-line-chart-line', subItems: [
          { name: 'Placement Stats', href: '/admin/analytics/placements' },
          { name: 'User Activity', href: '/admin/analytics/activity' },
          { name: 'Reports', href: '/admin/analytics/reports' },
        ]
      },
      {
        name: 'Placements', href: '/admin/placements', icon: 'ri-building-line', subItems: [
          { name: 'Manage Drives', href: '/admin/placements/drives' },
          { name: 'Applications', href: '/admin/placements/applications' },
        ]
      },
      {
        name: 'Settings', href: '/admin/settings', icon: 'ri-settings-3-line', subItems: [
          { name: 'System Config', href: '/admin/settings/system' },
          { name: 'User Roles', href: '/admin/settings/roles' },
        ]
      },
    ],
    company: [
      { name: 'Dashboard', href: '/company/dashboard', icon: 'ri-dashboard-line', subItems: [] },
      {
        name: 'Job Postings', href: '/company/jobs', icon: 'ri-briefcase-2-line', subItems: [
          { name: 'Create Job', href: '/company/jobs/create' },
          { name: 'Active Jobs', href: '/company/jobs/active' },
          { name: 'Closed Jobs', href: '/company/jobs/closed' },
        ]
      },
      {
        name: 'Applications', href: '/company/applications', icon: 'ri-file-list-2-line', subItems: [
          { name: 'Review Applications', href: '/company/applications/review' },
          { name: 'Select Applicants', href: '/company/applications/select' },
          { name: 'Shortlisted', href: '/company/applications/shortlisted' },
          { name: 'Rejected', href: '/company/applications/rejected' },
        ]
      },
      {
        name: 'Interviews', href: '/company/interviews', icon: 'ri-user-voice-line', subItems: [
          { name: 'Schedule Interview', href: '/company/interviews/schedule' },
          { name: 'Upcoming Interviews', href: '/company/interviews/upcoming' },
          { name: 'Past Interviews', href: '/company/interviews/past' },
        ]
      },
      { name: 'Analytics', href: '/company/analytics', icon: 'ri-bar-chart-line', subItems: [] },
      { name: 'Company Profile', href: '/company/profile', icon: 'ri-building-2-line', subItems: [] },
    ],
  };

  const [navItems, setNavItems] = useState(() => defaultNavItems[role]);

  // Handle screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle dark mode toggle and localStorage
  useEffect(() => {
    // Apply or remove 'dark' class on <html> based on darkMode state
    document.documentElement.classList.toggle('dark', darkMode);
    // Persist theme to localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const toggleSubItems = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const filteredNavItems = navItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subItems.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const breadcrumbs = location.pathname.split('/').filter(Boolean).map((part, index, arr) => {
    const path = `/${arr.slice(0, index + 1).join('/')}`;
    return { name: part.charAt(0).toUpperCase() + part.slice(1), href: path };
  });

  const isCollapsed = !isSidebarOpen && !isMobile;

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
          className={`fixed top-0 bottom-0 z-40 bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 shadow-xl ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
            }`}
          style={{ width: isMobile ? '280px' : (isCollapsed ? '4rem' : `${sidebarWidth}px`) }}
        >
          <div className="flex flex-col h-full">
            {/* Logo and Toggle */}
            <div className="flex items-center p-4 border-b border-blue-500/30">
              {!isCollapsed ? (
                <Link to="/" className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-graduation-cap-line text-lg"></i>
                  </div>
                  <span className="text-xl font-bold truncate">CampusConnect</span>
                </Link>
              ) : (
                <div className="h-8 w-8 bg-white text-blue-600 rounded-lg flex items-center justify-center mx-auto">
                  <i className="ri-graduation-cap-line text-lg"></i>
                </div>
              )}
              {!isMobile && (
                <button
                  className="ml-auto p-1 hover:bg-blue-500/30 rounded-lg transition-colors"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  <i className={`ri-${isSidebarOpen ? 'menu-fold' : 'menu-unfold'}-line text-xl`}></i>
                </button>
              )}
            </div>

            {/* Search Bar */}
            {!isCollapsed && (
              <div className="px-4 py-3 flex-shrink-0">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 z-10"></i>
                  <input
                    type="text"
                    placeholder="Search navigation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-500/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-blue-500/50 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-blue-600 scrollbar-thumb-blue-400 hover:scrollbar-thumb-blue-300">
              <ul className="p-2 sm:p-4 space-y-1">
                {filteredNavItems.map((item, index) => (
                  <li
                    key={item.name}
                    draggable={!isMobile}
                    onDragStart={(e) => !isMobile && handleDragStart(e, index)}
                    onDrop={(e) => !isMobile && handleDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    className="group relative"
                  >
                    <div
                      className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-blue-500/30 transition-all duration-200 cursor-pointer ${location.pathname === item.href ? 'bg-blue-500/50 shadow-lg' : ''
                        }`}
                      onClick={() => item.subItems.length > 0 && !isCollapsed && toggleSubItems(item.name)}
                    >
                      <Link to={item.href} className="flex items-center gap-3 flex-1 min-w-0">
                        <i className={`${item.icon} text-lg sm:text-xl flex-shrink-0`}></i>
                        {!isCollapsed && (
                          <span className="flex-1 font-medium text-sm sm:text-base truncate">{item.name}</span>
                        )}
                      </Link>
                      {!isCollapsed && item.subItems.length > 0 && (
                        <i className={`ri-arrow-down-s-line text-lg transform transition-transform duration-300 ${expandedItems[item.name] ? 'rotate-180' : ''
                          }`}></i>
                      )}
                    </div>

                    {/* Sub Items */}
                    {!isCollapsed && item.subItems.length > 0 && expandedItems[item.name] && (
                      <ul className="ml-6 sm:ml-8 mt-1 space-y-1 animate-fadeIn">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.href}
                              className={`block p-2 rounded-lg hover:bg-blue-400/30 transition-colors text-xs sm:text-sm ${location.pathname === subItem.href ? 'bg-blue-400/50 text-white' : 'text-blue-100'
                                }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tooltip for collapsed sidebar */}
                    {isCollapsed && (
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
            {!isCollapsed && (
              <div className="p-2 sm:p-4 border-t border-blue-500/30 flex-shrink-0">
                <h3 className="text-xs sm:text-sm font-semibold mb-3 text-blue-100">Quick Access</h3>
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

          {/* Resize Handle - Desktop only */}
          {!isMobile && isSidebarOpen && (
            <div
              className="absolute top-0 right-0 w-1 h-full bg-blue-400/50 cursor-col-resize hover:bg-blue-300 transition-colors"
              onMouseDown={() => setIsResizing(true)}
            />
          )}
        </aside>

        {/* Mobile Toggle */}

          {/* dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 */}


        <button
          className={`fixed top-4 items-center ${isSidebarOpen ? 'left-72' : 'left-0'} z-50 lg:hidden h-12 w-9 rounded-xl 
    bg-white dark:bg-gray-900/90 
    text-black dark:text-white 
    flex items-center justify-center 
     hover:brightness-90 
    transition-all duration-300`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-expanded={isSidebarOpen}
          aria-label="Toggle sidebar"
        >
          <i className={`ri-${isSidebarOpen ? 'close' : 'menu'}-line pb-3 text-lg`}></i>
        </button>


        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isMobile ? '' : (isCollapsed ? 'ml-16' : `ml-[${sidebarWidth}px]`)
            }`}
          onMouseMove={handleResize}
          onMouseUp={() => setIsResizing(false)}
          style={{
            marginLeft: isMobile ? 0 : (isCollapsed ? '4rem' : `${sidebarWidth}px`)
          }}
        >
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 truncate pl-6">
                    {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                  </h1>
                  {/* To center instead, replace pl-4 with text-center */}
                  {/* <h1 className="text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 truncate text-center"> */}
                  <div className="hidden ml-6 sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-1.5">
                    {breadcrumbs.map((crumb, index) => (
                      <div key={crumb.href} className="flex items-center">
                        <Link
                          to={crumb.href}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 truncate font-medium"
                        >
                          {crumb.name}
                        </Link>
                        {index < breadcrumbs.length - 1 && (
                          <i className="ri-arrow-right-s-line mx-1.5 text-gray-400 dark:text-gray-500 flex-shrink-0"></i>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative hidden md:block">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 lg:w-56 pl-9 pr-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 sm:p-2.5 lg:p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    aria-label="Notifications"
                    aria-expanded={isNotificationsOpen}
                  >
                    <i className="ri-notification-3-line text-lg sm:text-xl text-gray-600 dark:text-gray-300"></i>
                    {notifications.filter((n) => n.unread).length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm animate-pulse">
                        {notifications.filter((n) => n.unread).length}
                      </span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-slideDown">
                      <div className="p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                            <i className="ri-settings-3-line"></i>
                          </button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 sm:p-4 border-b border-gray-100/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                          >
                            <p className="text-sm text-gray-800 dark:text-gray-200 mb-1 font-medium">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 sm:p-2.5 lg:p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  aria-label="Toggle dark mode"
                >
                  <i
                    className={`ri-${darkMode ? 'sun' : 'moon'}-line text-lg sm:text-xl text-gray-600 dark:text-gray-300 transition-transform duration-300 ${darkMode ? 'rotate-180' : 'rotate-0'}`}
                  ></i>
                </button>

                <div className="relative dropdown-container">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 sm:p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    aria-label="Profile menu"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="text-right hidden md:block">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                        {role === 'company' ? user.company?.companyName : role === 'student' ? user.student?.name : 'Admin User'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {role}
                      </span>
                    </div>
                    <img
                      src={
                        role === 'company'
                          ? user.company?.companyProfile || 'https://via.placeholder.com/150'
                          : role === 'student'
                            ? user.student?.profilePhoto || 'https://via.placeholder.com/150'
                            : user.profilePhoto?user.profilePhoto: 'https://via.placeholder.com/150'
                      }
                      alt="User avatar"
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-white dark:border-gray-700 shadow-md hover:scale-105 transition-transform duration-200"
                    />
                    <i className="ri-arrow-down-s-line text-gray-500 hidden sm:block transition-transform duration-200"></i>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-slideDown">
                      <Link
                        to="student/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-colors duration-200"
                      >
                        <i className="ri-user-line text-lg"></i>
                        <span className="font-medium">Profile</span>
                      </Link>

                      <hr className="border-gray-200/50 dark:border-gray-700/50" />
                      <button className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors duration-200" onClick={handleLogOut}>
                        <i className="ri-logout-box-line text-lg"></i>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Mobile Backdrop */}
        {isMobile && (
          <div
            className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
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

        /* Mobile responsive adjustments */
        @media (max-width: 640px) {
          .dropdown-container > div {
            left: auto !important;
            right: 0 !important;
            width: calc(100vw - 2rem) !important;
            max-width: 320px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;