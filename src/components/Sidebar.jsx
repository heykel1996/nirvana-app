import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lvmdp', label: 'LVMDP', icon: '⚡', sublabel: 'Panel Tegangan Rendah' },
    { path: '/stp', label: 'STP', icon: '🌊', sublabel: 'Sewage Treatment Plant' },
    { path: '/water-log', label: 'Water Log', icon: '💧', sublabel: 'Water Log Sheet' },
    { path: '/genset-log', label: 'Genset Log', icon: '️', sublabel: 'Log Sheet Genset' },
    { path: '/electrical-log', label: 'Electrical Log', icon: '', sublabel: 'Electrical Log Sheet' },
    { path: '/check-sheets', label: 'Check Sheets', icon: '📋', sublabel: 'Building Equipment' },
    { path: '/photo-docs', label: 'Photo Docs', icon: '📷', sublabel: 'Photo Documentation' },
    { path: '/shift-handover', label: 'Shift Handover', icon: '', sublabel: 'Serah Terima Shift' },
    { path: '/reports', label: 'Reports', icon: '📈', sublabel: 'Laporan' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleMenuClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gray-900 text-white z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Nirvana MEP" className="h-10 w-auto" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <p className="font-semibold text-sm">Nirvana Residence</p>
          <p className="text-xs text-gray-400">Engineer</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                {item.sublabel && (
                  <p className="text-xs text-gray-400">{item.sublabel}</p>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;