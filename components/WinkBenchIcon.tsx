'use client';

import React from 'react';

interface WinkBenchIconProps {
  className?: string;
  size?: number;
}

export default function WinkBenchIcon({
  className = '',
  size = 40,
}: WinkBenchIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="wbIconBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0052FF" />
        </linearGradient>
        <linearGradient id="wbIconGreenBubble" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="128" fill="url(#wbIconBlueGrad)" />

      {/* W lettermark in white */}
      <path
        d="M130 190 C120 180, 100 195, 95 230 L160 380 C175 410, 215 410, 230 380 L256 310 L282 380 C297 410, 337 410, 352 380 L400 270 C410 245, 385 225, 365 240 L330 325 L290 230 C280 205, 245 205, 235 230 L195 325 Z"
        fill="#FFFFFF"
      />

      {/* Head dot */}
      <circle cx="205" cy="225" r="22" fill="#FFFFFF" />

      {/* Winking mouth/curve */}
      <path
        d="M245 195 L285 218 L248 245"
        stroke="#FFFFFF"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Speech Bubble with Star */}
      <g transform="translate(290, 95)">
        <rect x="0" y="0" width="145" height="110" rx="35" fill="url(#wbIconGreenBubble)" />
        <path d="M25 105 L0 140 L50 108 Z" fill="#059669" />
        <polygon
          points="72,25 82,48 108,51 88,68 94,93 72,80 50,93 56,68 36,51 62,48"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}
