import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import InputBox from './InputBox';
import ExamplePrompts from './ExamplePrompts';
import { sendChatMessage } from '../services/api';

const Chat = ({ onDebugUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);
    onDebugUpdate(null);

    try {
      const response = await sendChatMessage(text);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
      
      if (response.debug) {
        onDebugUpdate(response.debug);
      }
    } catch (err) {
      const errorMsg = err.message || 'Something went wrong while connecting to the server.';
      setError(errorMsg);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMsg.includes('frontend-only')
          ? '⚠️ Note: The backend server is currently offline because this project is hosted frontend-only. To test live AI function calling and order tracking, please fork the repository on GitHub (ameyg11/CartGPT), add your Gemini API key, and run the backend locally!'
          : 'Sorry, I encountered an error communicating with the AI service. Please check your server connection.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-strong rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(250,250,252,0.78) 50%, rgba(245,245,247,0.82) 100%)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        border: '1px solid rgba(255,255,255,0.65)',
      }}
    >
      
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#e5e5ea]/60 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">Customer Support</h2>
          <p className="text-[11px] text-[#86868b] mt-0.5">Powered by Gemini AI • Interactive Demo</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-full border border-[#e5e5ea]/40">
          <div className="w-[6px] h-[6px] rounded-full bg-[#30d158] animate-subtle-pulse" />
          <span className="text-[10px] text-[#86868b] font-medium">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 relative">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center">
            {/* Welcome state */}
            <div className="text-center mb-6">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007aff]/10 to-[#5856d6]/10 items-center justify-center mb-2.5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">How can we help?</h3>
              <p className="text-[13px] text-[#86868b] mt-1">Ask about orders, tracking, cancellations, and more.</p>
            </div>
            <ExamplePrompts onSelectPrompt={handleSendMessage} disabled={isLoading} />
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <Message key={idx} role={msg.role} content={msg.content} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="bg-white/80 border border-[#e5e5ea]/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#007aff]/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-[#007aff]/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-[#007aff]/60 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-center text-xs text-amber-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50 animate-fade-in-up">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <InputBox onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat;
