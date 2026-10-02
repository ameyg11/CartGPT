import React from 'react';

const ToolDebugPanel = ({ debugInfo }) => {
  const hasCalls = debugInfo?.toolCalls?.length > 0;

  return (
    <div className="rounded-xl overflow-hidden text-xs font-mono h-full max-h-[260px] overflow-y-auto"
      style={{
        background: 'rgba(28, 28, 30, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {!hasCalls ? (
        <div className="p-4 text-[#86868b] flex items-center justify-center h-[80px]">
          <span className="opacity-60">No tool calls executed yet.</span>
        </div>
      ) : (
        <div className="p-3 space-y-2.5">
          {debugInfo.toolCalls.map((call, index) => (
            <div key={index} className="bg-white/[0.04] rounded-lg p-3 border border-white/[0.06] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Tool name + turn badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#30d158] font-semibold">⚡ {call.name}</span>
                {call.turn && (
                  <span className="text-[9px] bg-white/[0.08] text-[#86868b] px-1.5 py-0.5 rounded-full font-medium">
                    Turn {call.turn}
                  </span>
                )}
              </div>
              
              {/* Arguments */}
              <div className="mb-1.5">
                <span className="text-[#86868b] text-[9px] uppercase tracking-wider font-semibold">Args</span>
                <pre className="mt-1 bg-black/30 p-2 rounded-md text-[#5ac8fa] text-[11px] overflow-x-auto leading-relaxed">
                  {JSON.stringify(call.arguments, null, 2)}
                </pre>
              </div>
              
              {/* Result (if present) */}
              {call.result && (
                <div>
                  <span className="text-[#86868b] text-[9px] uppercase tracking-wider font-semibold">Result</span>
                  <pre className="mt-1 bg-black/30 p-2 rounded-md text-[#ff9f0a] text-[11px] overflow-x-auto leading-relaxed">
                    {JSON.stringify(call.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolDebugPanel;
