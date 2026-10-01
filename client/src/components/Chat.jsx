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
    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);
    onDebugUpdate(null); // Clear previous debug info

    try {
      const response = await sendChatMessage(text);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
      
      // Update debug panel
      if (response.debug) {
        onDebugUpdate(response.debug);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while connecting to the server.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check the server connection.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white/80 p-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
        <div>
          <h2 className="font-bold text-slate-800">Customer Support</h2>
          <p className="text-xs text-slate-500">Ask about your orders</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center">
            <ExamplePrompts onSelectPrompt={handleSendMessage} disabled={isLoading} />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <Message key={idx} role={msg.role} content={msg.content} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center h-[44px]">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-center text-xs text-red-500 my-2 bg-red-50 p-2 rounded-lg border border-red-100">
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
