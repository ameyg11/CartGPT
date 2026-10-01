import React from 'react';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
        }`}
      >
        <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
          {isUser ? 'You' : 'AI Assistant'}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Message;
