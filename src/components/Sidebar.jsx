import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lvmdp', label: 'LVMDP', icon: '⚡', sublabel: 'Panel Tegangan Rendah' },
    { path: '/stp', label: 'STP', icon: '🌊', sublabel: 'Sewage Treatment Plant' },
    { path: '/water-log', label: 'Water Log', icon: '💧', sublabel: 'Water Log Sheet' },
    { path: '/genset-log', label: 'Genset Log', icon: '⚙️', sublabel: 'Log Sheet Genset' },
    { path: '/electrical-log', label: 'Electrical Log', icon: '🔌', sublabel: 'Electrical Log Sheet' },
    { path: '/check-sheets', label: 'Check Sheets', icon: '📋', sublabel: 'Building Equipment' },
    { path: '/photo-docs', label: 'Photo Docs', icon: '📷', sublabel: 'Photo Documentation' },
    { path: '/shift-handover', label: 'Shift Handover', icon: '🔄', sublabel: 'Serah Terima Shift' },
    { path: '/reports', label: 'Reports', icon: '📈', sublabel: 'Laporan' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex-shrink-0`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img src={logo} alt="Nirvana MEP" className="h-12 w-auto" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-700">
          <p className="font-semibold text-sm">Nirvana Residence</p>
          <p className="text-xs text-gray-400">Engineer</p>
        </div>
      )}

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                {item.sublabel && (
                  <p className="text-xs text-gray-400">{item.sublabel}</p>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;