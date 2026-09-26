import React from 'react';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      {children}
    </div>
  );
}
