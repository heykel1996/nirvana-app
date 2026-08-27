const logoUrl = '/logo.png';

const LoadingScreen = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Container dengan Animasi */}
        <div className="relative mb-8">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          
          {/* Logo */}
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <img 
              src={logoUrl} 
              alt="Nirvana Residence" 
              className="w-48 h-48 object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
            NIRVANA RESIDENCE
          </h2>
          <p className="text-blue-300 text-lg font-medium">
            MEP Engineering
          </p>
          
          {/* Loading Spinner */}
          <div className="flex justify-center mt-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mt-4 animate-pulse">
            {text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-progress"></div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;