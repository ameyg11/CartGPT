import React, { useState } from 'react';
import Chat from './components/Chat';
import ToolDebugPanel from './components/ToolDebugPanel';

function App() {
  const [debugInfo, setDebugInfo] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col">
      
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-bold text-xl">
              O
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">Orderly Chaos</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">AI Support Playground</p>
            </div>
          </div>
          <div className="hidden sm:flex text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
            Developer Mode
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-64px)]">
        
        {/* Left Column - Chat */}
        <div className="flex-1 lg:w-2/3 h-full min-h-[400px]">
          <Chat onDebugUpdate={setDebugInfo} />
        </div>

        {/* Right Column - Debug Info */}
        <div className="w-full lg:w-1/3 h-64 lg:h-full">
          <ToolDebugPanel debugInfo={debugInfo} />
        </div>
        
      </main>
    </div>
  );
}

export default App;
