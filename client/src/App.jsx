import React, { useState } from 'react';
import Chat from './components/Chat';
import ToolDebugPanel from './components/ToolDebugPanel';
import Footer from './components/Footer';

function App() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [debugOpen, setDebugOpen] = useState(false);

  const handleDebugUpdate = (info) => {
    setDebugInfo(info);
    if (info && info.toolCalls && info.toolCalls.length > 0) {
      setDebugOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col items-center justify-start relative overflow-x-hidden">
      
      {/* Very subtle ambient gradient orbs — Apple style */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/20 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-pink-100/30 to-orange-100/15 blur-3xl" />
      </div>

      {/* Main Centered Container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-5 flex flex-col min-h-screen justify-between">
        
        {/* Top Header / Branding — minimal floating above chat */}
        <div className="text-center pt-2 pb-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007aff] to-[#5856d6] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <div className="text-left">
              <h1 className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">Orderly Chaos</h1>
              <p className="text-[10px] text-[#86868b] font-medium tracking-wide uppercase">AI Support</p>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 min-h-[480px] max-h-[580px] flex flex-col animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <Chat onDebugUpdate={handleDebugUpdate} />
        </div>

        {/* Tool Debug Panel — collapsible below chat */}
        <div className="mt-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setDebugOpen(!debugOpen)}
            className="glass-btn w-full rounded-xl px-4 py-2 flex items-center justify-between text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
              </svg>
              <span>Tool Calls Debug</span>
              {debugInfo?.toolCalls?.length > 0 && (
                <span className="bg-[#007aff]/10 text-[#007aff] px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                  {debugInfo.toolCalls.length}
                </span>
              )}
            </div>
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-200 ${debugOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${debugOpen ? 'max-h-[280px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <ToolDebugPanel debugInfo={debugInfo} />
          </div>
        </div>

        {/* Footer with Project Message and Social/GitHub Logos */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
