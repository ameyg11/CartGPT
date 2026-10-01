import React from 'react';

const ToolDebugPanel = ({ debugInfo }) => {
  if (!debugInfo || !debugInfo.toolCalls || debugInfo.toolCalls.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 text-slate-400 text-xs border border-slate-800 font-mono h-full flex flex-col">
        <div className="mb-2 uppercase tracking-widest text-[10px] text-slate-500 font-bold border-b border-slate-800 pb-2">Tool Calls Debug</div>
        <div className="flex-1 flex items-center justify-center opacity-50">
          No tool calls executed yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-slate-300 text-xs border border-slate-800 font-mono h-full overflow-y-auto custom-scrollbar">
      <div className="mb-4 uppercase tracking-widest text-[10px] text-slate-500 font-bold border-b border-slate-800 pb-2 sticky top-0 bg-slate-900">
        Tool Calls Debug
      </div>
      
      <div className="space-y-4">
        {debugInfo.toolCalls.map((call, index) => (
          <div key={index} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400 font-bold">▶ {call.name}</span>
            </div>
            
            <div className="mb-2">
              <span className="text-slate-500 text-[10px] uppercase">Arguments:</span>
              <pre className="mt-1 bg-black/40 p-2 rounded text-blue-300 overflow-x-auto">
                {JSON.stringify(call.arguments, null, 2)}
              </pre>
            </div>
            
            {call.result && (
              <div>
                <span className="text-slate-500 text-[10px] uppercase">Result:</span>
                <pre className="mt-1 bg-black/40 p-2 rounded text-orange-300 overflow-x-auto">
                  {JSON.stringify(call.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolDebugPanel;
