import React from 'react';

interface MobileHeaderProps {
  isLoading: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isLoading }) => {
  return (
    <header className="text-center py-6 px-4">
      <h1 className="text-3xl font-bold">Wrestling Circle Jerks</h1>
      <p className="text-slate-400">Haiku Generator</p>
      <p className="text-xs text-slate-500 mt-2">
        {isLoading ? 'Loading wrestling data…' : 'Ready to generate'}
      </p>
    </header>
  );
};

export default MobileHeader;