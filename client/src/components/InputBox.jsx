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
    <form onSubmit={handleSubmit} className="flex gap-2.5 items-end border-t border-[#e5e5ea]/40 px-5 py-4"
      style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your order..."
        className="flex-1 resize-none overflow-hidden rounded-xl bg-[#f5f5f7]/80 border border-[#e5e5ea]/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007aff]/15 focus:border-[#007aff]/40 transition-all text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] h-[44px] min-h-[44px] max-h-28"
        rows="1"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="glass-btn-primary h-[44px] w-[44px] rounded-xl flex items-center justify-center flex-shrink-0"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
};

export default InputBox;
