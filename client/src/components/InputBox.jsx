import React, { useState } from 'react';

const InputBox = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end border-t border-slate-100 p-4 bg-white/50 backdrop-blur-sm rounded-b-2xl">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question..."
        className="flex-1 resize-none overflow-hidden rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm h-[46px] min-h-[46px] max-h-32 shadow-inner"
        rows="1"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="h-[46px] px-6 rounded-xl bg-blue-600 text-white font-medium text-sm transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-95"
      >
        Send
      </button>
    </form>
  );
};

export default InputBox;
