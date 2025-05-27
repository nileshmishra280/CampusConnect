import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = ({ role }) => {
  return (
    <div className="flex flex-col min-h-screen">
     <Navigation role={role} />
        <main className="flex-1 p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
    
  );
};

export default Layout;