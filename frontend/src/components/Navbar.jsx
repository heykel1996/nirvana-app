import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, {user?.full_name || 'User'}
          </h2>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {user?.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;