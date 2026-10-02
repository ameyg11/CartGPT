import React from 'react';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div 
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-[#007aff] text-white rounded-br-md shadow-[0_2px_12px_rgba(0,122,255,0.2)]' 
            : 'bg-white/80 border border-[#e5e5ea]/50 text-[#1d1d1f] rounded-bl-md shadow-sm'
        }`}
      >
        <div className={`text-[10px] mb-1 font-medium tracking-wide uppercase ${
          isUser ? 'text-white/60' : 'text-[#86868b]'
        }`}>
          {isUser ? 'You' : 'AI Assistant'}
        </div>
        <div className="text-[13px] leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Message;
