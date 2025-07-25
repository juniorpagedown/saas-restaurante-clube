import Image from 'next/image'

interface ApexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

export function ApexLogo({ size = 'md', className = '', showText = true }: ApexLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo SVG inline para melhor controle */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Círculo externo */}
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="none" 
            stroke="url(#gradient1)" 
            strokeWidth="2"
          />
          
          {/* Triângulos sobrepostos formando o "A" */}
          <path 
            d="M30 70 L50 25 L70 70 Z" 
            fill="url(#gradient2)" 
            stroke="white" 
            strokeWidth="1"
          />
          <path 
            d="M35 65 L50 35 L65 65 Z" 
            fill="url(#gradient3)" 
            stroke="white" 
            strokeWidth="1"
          />
          <path 
            d="M40 60 L50 45 L60 60 Z" 
            fill="white" 
          />
          
          {/* Gradientes */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          APEX
        </span>
      )}
    </div>
  )
}