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

  // Calculate circumference for progress circle (semi-circle)
  // SVG path uses radius 40 (from x=10 to x=90, center at x=50)
  const arcRadius = 40;
  const circumference = Math.PI * arcRadius; // Semi-circle circumference

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
    if (normalizedScore < 30) return '#00b894'; // Green - safe
    if (normalizedScore < 60) return '#fdcb6e'; // Yellow - warning
    return '#e17055'; // Red - danger
  };

  const getRiskLabel = () => {
    if (normalizedScore < 30) return 'ìì ';
    if (normalizedScore < 60) return 'ì£¼ì';
    return 'ìí';
  };

  const getRiskLabelColor = () => {
    if (normalizedScore < 30) return 'text-success';
    if (normalizedScore < 60) return 'text-warning';
    return 'text-danger';
  };

  // Calculate stroke-dashoffset for progress arc
  // 0% progress = full offset, 100% progress = 0 offset
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background semi-circle arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#2d2d44"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Progress semi-circle arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={getRiskColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease',
              transformOrigin: '50px 50px',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className={`${textSizeClasses[size]} font-bold gradient-text`}>
            {normalizedScore}
          </div>
          <div className={`text-sm font-medium ${getRiskLabelColor()} mt-1`}>
            {getRiskLabel()}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="mt-6 flex justify-between w-full max-w-xs text-xs text-gray-500 font-medium px-2">
        <span>ìì£</span>
        <span>ìí</span>
      </div>
    </div>
  );
}
