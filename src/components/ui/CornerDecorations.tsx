"use client";

import React from "react";

export default function CornerDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[40] mix-blend-difference">
      {/* Top Left */}
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          top: 'var(--corner-safe-zone)', 
          left: 'var(--corner-safe-zone)',
          width: 'var(--corner-length)',
          height: '1px'
        }}
      />
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          top: 'var(--corner-safe-zone)', 
          left: 'var(--corner-safe-zone)',
          width: '1px',
          height: 'var(--corner-length)'
        }}
      />

      {/* Top Right */}
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          top: 'var(--corner-safe-zone)', 
          right: 'var(--corner-safe-zone)',
          width: 'var(--corner-length)',
          height: '1px'
        }}
      />
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          top: 'var(--corner-safe-zone)', 
          right: 'var(--corner-safe-zone)',
          width: '1px',
          height: 'var(--corner-length)'
        }}
      />

      {/* Bottom Left */}
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          bottom: 'var(--corner-safe-zone)', 
          left: 'var(--corner-safe-zone)',
          width: 'var(--corner-length)',
          height: '1px'
        }}
      />
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          bottom: 'var(--corner-safe-zone)', 
          left: 'var(--corner-safe-zone)',
          width: '1px',
          height: 'var(--corner-length)'
        }}
      />

      {/* Bottom Right */}
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          bottom: 'var(--corner-safe-zone)', 
          right: 'var(--corner-safe-zone)',
          width: 'var(--corner-length)',
          height: '1px'
        }}
      />
      <div 
        className="absolute bg-[#FAF9F6] opacity-20"
        style={{ 
          bottom: 'var(--corner-safe-zone)', 
          right: 'var(--corner-safe-zone)',
          width: '1px',
          height: 'var(--corner-length)'
        }}
      />
    </div>
  );
}
