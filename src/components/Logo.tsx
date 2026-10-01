import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  lightText = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dim = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Circular Seal */}
      <div className={`relative ${dim} rounded-full overflow-hidden shrink-0 shadow-sm border border-[#08783F]/30 bg-white flex items-center justify-center`}>
        {/* Render the high-definition official logo */}
        <img
          src="/src/assets/images/istag_official_logo_1790553139049.jpg"
          alt="Logo Officiel - Institut Supérieur des Technologies Avancées (ISTAG)"
          className="w-full h-full object-cover scale-102"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* SVG Fallback container underneath */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full pointer-events-none -z-10"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="95" fill="#08783F" stroke="#056331" strokeWidth="2" />
          <circle cx="100" cy="100" r="70" fill="#FFFFFF" />
          {/* Stars */}
          <polygon points="25,100 28,92 37,92 30,86 33,78 25,83 17,78 20,86 13,92 22,92" fill="#F5B51B" />
          <polygon points="175,100 172,92 163,92 170,86 167,78 175,83 183,78 180,86 187,92 178,92" fill="#F5B51B" />
          {/* Central ISTAG text */}
          <text x="100" y="150" textAnchor="middle" fill="#F5B51B" fontWeight="bold" fontSize="24" fontFamily="sans-serif">ISTAG</text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-brand font-bold text-xl sm:text-2xl tracking-tight leading-none ${
                lightText ? 'text-white' : 'text-[#1F2933]'
              }`}
            >
              ISTAG
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
              lightText 
                ? 'text-[#F5B51B] bg-[#056331] border-[#F5B51B]/40' 
                : 'text-[#08783F] bg-[#08783F]/10 border-[#08783F]/30'
            }`}>
              GAGNOA
            </span>
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase font-semibold mt-1 ${
              lightText ? 'text-[#F5B51B]' : 'text-[#08783F]'
            }`}
          >
            Institut Supérieur des Technologies Avancées
          </span>
        </div>
      )}
    </div>
  );
};
