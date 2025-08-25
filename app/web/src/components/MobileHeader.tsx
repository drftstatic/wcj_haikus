import React from 'react';

interface MobileHeaderProps {
  isLoading: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isLoading }) => {
  return (
    <header className="text-center py-8 px-4 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-red-600/5 to-amber-500/5 blur-3xl" />
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-bl from-violet-600/5 to-red-600/5 blur-3xl" />
      </div>
      
      <div className="max-w-sm mx-auto relative z-10">
        {/* Logo with modern image formats */}
        <div className="mb-6">
          <img 
            src="/assets/wcj_logo.png" 
            alt="Wrestling Circle Jerks Logo" 
            className="mx-auto h-16 sm:h-20 object-contain animate-fade-in" 
            style={{ imageRendering: 'crisp-edges' }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        
        {/* Title and Tagline */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight leading-tight">
            Haiku <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Forge</span>
          </h1>
          <p className="text-slate-400 text-base px-4">
            Generate wrestling haikus powered by Wrestling Circle Jerks
          </p>
          
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'
            }`} />
            <span className="text-slate-500">
              {isLoading ? 'Loading wrestling data...' : 'Ready to generate'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;