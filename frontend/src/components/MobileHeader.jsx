const MobileHeader = ({ onMenuClick, title }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm lg:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <h1 className="text-lg font-semibold text-gray-900 truncate">
        {title || 'Nirvana MEP'}
      </h1>
      
      <div className="w-10"></div>
    </header>
  );
};

export default MobileHeader;