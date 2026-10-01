'use client';

import React from 'react';

interface WinkBenchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export default function WinkBenchLogo({
  className = '',
  size = 'md',
  variant = 'dark',
  showSubtitle = false,
}: WinkBenchLogoProps) {
  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon matching user's official uploaded WinkBench Icon */}
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heights[size]} w-auto aspect-square shrink-0`}
      >
        <defs>
          <linearGradient id="wbBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0052FF" />
          </linearGradient>
          <linearGradient id="wbGreenBubble" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="subtleDrop" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0044CC" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Squircle container background */}
        <rect width="512" height="512" rx="128" fill="url(#wbBlueGrad)" />

        {/* W lettermark in white */}
        {/* Left arm */}
        <path
          d="M130 190 C120 180, 100 195, 95 230 L160 380 C175 410, 215 410, 230 380 L256 310 L282 380 C297 410, 337 410, 352 380 L400 270 C410 245, 385 225, 365 240 L330 325 L290 230 C280 205, 245 205, 235 230 L195 325 Z"
          fill="#FFFFFF"
          filter="url(#subtleDrop)"
        />

        {/* Rounded head dot */}
        <circle cx="205" cy="225" r="22" fill="#FFFFFF" />

        {/* Winking eye / mouth curve */}
        <path
          d="M245 195 L285 218 L248 245"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Speech Bubble with 5-star review */}
        <g transform="translate(290, 95)">
          {/* Bubble body */}
          <rect x="0" y="0" width="145" height="110" rx="35" fill="url(#wbGreenBubble)" />
          {/* Bubble tail */}
          <path d="M25 105 L0 140 L50 108 Z" fill="#059669" />
          {/* Five-point star */}
          <polygon
            points="72,25 82,48 108,51 88,68 94,93 72,80 50,93 56,68 36,51 62,48"
            fill="#FFFFFF"
          />
        </g>
      </svg>

      {/* Typography: Wink in Navy, Bench in Electric Blue */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline tracking-tight font-black">
          <span
            className={`text-2xl sm:text-3xl tracking-tight ${
              variant === 'light' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Wink
          </span>
          <span className="text-2xl sm:text-3xl tracking-tight text-blue-600">
            Bench
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[9px] font-bold uppercase tracking-widest ${
              variant === 'light' ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Global Business Reviews & Trust
          </span>
        )}
      </div>
    </div>
  );
}
