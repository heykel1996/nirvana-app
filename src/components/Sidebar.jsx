import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BoltIcon,
  BeakerIcon,
  CpuChipIcon,
  ClipboardDocumentCheckIcon,
  CameraIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  DocumentTextIcon,
  // BatteryIcon tidak ada di Heroicons, gunakan BoltIcon atau PowerIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'LVMDP', href: '/lvmdp', icon: BoltIcon },
  { name: 'STP', href: '/stp', icon: BeakerIcon },
  { name: 'Water Log', href: '/water-level', icon: CpuChipIcon },
  { name: 'Genset Log', href: '/genset-log', icon: BoltIcon },  // ← Gunakan BoltIcon
  { name: 'Electrical Log', href: '/elektrikal-pln', icon: BoltIcon },
  { name: 'Check Sheets', href: '/check-sheets', icon: ClipboardDocumentCheckIcon },
  { name: 'Photo Docs', href: '/photo-documentation', icon: CameraIcon },
  { name: 'Shift Handover', href: '/shift-handover', icon: ArrowsRightLeftIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-72 bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="flex items-center justify-center h-40 px-4 bg-white/5 border-b border-white/10">
          <div className="text-center">
            <img src="/logo.png" alt="Nirvana Residence" className="h-24 w-auto object-contain mx-auto" />
            <h1 className="mt-3 text-xl font-bold text-white tracking-wide">NIRVANA</h1>
            <p className="text-xs text-blue-300 font-medium">MEP Engineering</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto py-4">
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="text-center text-xs text-gray-400">© 2026 Nirvana Residence</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;