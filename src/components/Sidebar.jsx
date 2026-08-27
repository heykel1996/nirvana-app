import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BoltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const logoUrl = '/logo.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'LVMDP', href: '/lvmdp', icon: BoltIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-72 bg-gradient-to-b from-slate-900 to-blue-900">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-40 px-4 bg-white/5 border-b border-white/10">
          <div className="text-center">
            <img 
              src={logoUrl} 
              alt="Nirvana Residence" 
              className="h-24 w-auto object-contain mx-auto"
            />
            <h1 className="mt-3 text-xl font-bold text-white tracking-wide">
              NIRVANA
            </h1>
            <p className="text-xs text-blue-300 font-medium">
              MEP Engineering
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto py-4">
          <nav className="flex-1 px-3 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-center text-xs text-gray-400">
            © 2026 Nirvana Residence
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;