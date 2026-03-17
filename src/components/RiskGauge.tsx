'use client';

import React from 'react';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function RiskGauge({
  score,
  size = 'md',
  className = '',
}: RiskGaugeProps) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  // Calculate rotation (0-100 maps to 180-0 degrees)
  const rotation = 180 - (normalizedScore / 100) * 180;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const textSizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  const getRiskColor = () => {
    if (normalizedScore < 30) return '#00b894';
    if (normalizedScore < 60) return '#fdcb6e';
    return '#e17055';
  };

  const getRiskLabel = () => {
    if (normalizedScore < 30) return '낮음';
    if (normalizedScore < 60) return '중간';
    return '높음';
  };

  const getRiskLabelColor = () => {
    if (normalizedScore < 30) return 'text-success';
    if (normalizedScore < 60) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background circle */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          style={{
            transform: 'scaleX(-1)',
          }}
        >
          {/* Background arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2d2d44"
            strokeWidth="8"
          />

          {/* Score arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getRiskColor()}
            strokeWidth="8"
            strokeDasharray={`${(normalizedScore / 100) * 141.3} 141.3`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.5s ease',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${textSizeClasses[size]} font-bold gradient-text`}>
            {normalizedScore}
          </div>
          <div className={`text-sm font-medium ${getRiskLabelColor()}`}>
            {getRiskLabel()}
          </div>
        </div>

        {/* Needle */}
        <div
          className="absolute top-1/2 left-1/2 origin-left transform -translate-y-1/2"
          style={{
            transform: `translateX(-50%) translateY(-50%) rotate(${rotation}deg)`,
            transition: 'transform 0.5s ease',
          }}
        >
          <div className="w-20 h-2 rounded-full bg-gradient-primary shadow-lg" />
        </div>
      </div>

      {/* Labels */}
      <div className="mt-4 flex justify-between w-full max-w-xs text-xs text-gray-500 font-medium">
        <span>안전</span>
        <span>위험</span>
      </div>
    </div>
  );
}
