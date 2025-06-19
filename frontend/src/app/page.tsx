'use client';

import React from 'react';
import SpaceScene from './components/SpaceScene';

export default function Home() {
  return (
    <main className="w-screen h-screen bg-black overflow-hidden">
      {/* 3D Space Scene */}
      <div className="w-full h-full">
        <SpaceScene />
      </div>
    </main>
  );
} 