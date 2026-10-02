import React from 'react';

const prompts = [
  // Order tracking variations
  { label: "📦 Track ORD1001", text: "Where is my order ORD1001? What's the tracking status?" },
  { label: "🔍 Status of ORD1005", text: "What's the current status of order ORD1005?" },
  { label: "🚚 Delivery estimate", text: "When will order ORD1002 arrive? Give me the estimated delivery." },
  
  // Cancellation variations
  { label: "❌ Cancel ORD1007", text: "Check if order ORD1007 can be cancelled and if yes, cancel it" },
  { label: "🔄 Can I cancel ORD1001?", text: "Is order ORD1001 eligible for cancellation?" },
  
  // General inquiries
  { label: "🧾 My order details", text: "Show me full details for order ORD1004 including items and payment" },
  { label: "💳 Refund status", text: "What happened with the refund for order ORD1003?" },
  { label: "📋 All my orders", text: "Show me all orders and their current statuses" },
];

const ExamplePrompts = ({ onSelectPrompt, disabled }) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-[11px] text-[#86868b] mb-4 uppercase tracking-widest font-semibold">Try asking</p>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt.text)}
            disabled={disabled}
            className="glass-btn text-[12px] px-3.5 py-2 rounded-xl text-[#3a3a3c] font-medium shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
