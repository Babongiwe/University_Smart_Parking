import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, MapPin, ArrowLeft } from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const KovsieBotModal: React.FC = () => {
  const { isKovsieBotOpen, setIsKovsieBotOpen, zones } = useParking();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: "Dumela & Hello! I'm KovsieBot, your official UFS Smart Parking Assistant. How can I help you find available parking, apply for a digital permit, or answer campus parking policy questions today?",
      time: 'Just now'
    }
  ]);

  if (!isKovsieBotOpen) return null;

  const handleSend = (userText: string = inputMessage) => {
    if (!userText.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let botResponse = "I'm here to assist with all University of the Free State parking inquiries.";
      const query = userText.toLowerCase();

      if (query.includes('available') || query.includes('where') || query.includes('bay')) {
        const studentZone = zones.find((z) => z.code === 'Z-STU-01') || zones[0];
        const freeBays = studentZone.totalBays - studentZone.occupiedBays;
        botResponse = `Currently, ${studentZone.name} has ${freeBays} available bays (${Math.round((studentZone.occupiedBays / studentZone.totalBays) * 100)}% occupied). Bloemfontein Main Campus Visitor Gateway also has spaces available.`;
      } else if (query.includes('permit') || query.includes('apply') || query.includes('cost') || query.includes('tariff')) {
        botResponse = "Student permits for 2026 are R450 per annum, and Staff permits are R650. You can submit an application with your vehicle registration document directly from the 'Apply for Permit' tab.";
      } else if (query.includes('grace') || query.includes('15') || query.includes('fine') || query.includes('citation')) {
        botResponse = "UFS Protection Services enforces a 15-minute courtesy grace period. If a vehicle enters a restricted zone or is unpermitted, an optical ALPR timer begins. If the vehicle vacates within 15 minutes, no violation fine is issued. After 15 minutes, an automated R350 citation is generated.";
      } else if (query.includes('visitor') || query.includes('guest')) {
        botResponse = "Visitors can pre-register their vehicle via the Visitor Portal to receive an instant optical QR access pass and allocated bay for R50/day.";
      } else {
        botResponse = "You can manage your registered vehicles, view your active digital QR passes, or settle any outstanding traffic citations directly in the KovsiePark system.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[580px] text-xs text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsKovsieBotOpen(false)}
              className="p-1.5 px-2.5 rounded-xl text-slate-300 hover:text-amber-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-all font-semibold mr-1 cursor-pointer group"
              title="Go Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs">Back</span>
            </button>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm">KovsieBot AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400">UFS Smart Parking Navigator</p>
            </div>
          </div>
          <button
            onClick={() => setIsKovsieBotOpen(false)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`block text-[9px] mt-1 ${
                    m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend('Where is student parking available right now?')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 whitespace-nowrap shrink-0"
          >
            📍 Available bays now?
          </button>
          <button
            onClick={() => handleSend('How does the 15-minute grace period work?')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 whitespace-nowrap shrink-0"
          >
            ⏱️ 15m Grace Period rules
          </button>
          <button
            onClick={() => handleSend('How do I apply for a 2026 parking permit?')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 whitespace-nowrap shrink-0"
          >
            💳 2026 Permit Tariffs
          </button>
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask KovsieBot anything about campus parking..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
