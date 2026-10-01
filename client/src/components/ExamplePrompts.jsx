import React from 'react';

const prompts = [
  "Where is ORD1001?",
  "What's the status of ORD1005?",
  "When will my order arrive?",
  "Can I cancel ORD1003?",
  "What did I order?"
];

const ExamplePrompts = ({ onSelectPrompt, disabled }) => {
  return (
    <div className="mb-6 flex flex-col items-center">
      <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">Try asking</p>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
