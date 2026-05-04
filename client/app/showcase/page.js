"use client";
import React from 'react';
import LeftPanel from './components/LeftPanel';
import RightCanvas from './components/RightCanvas';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen w-full bg-[#EEF2F6] flex flex-col lg:flex-row overflow-hidden font-sans text-[#0F172A]">
      <LeftPanel />
      <RightCanvas />
    </div>
  );
}
