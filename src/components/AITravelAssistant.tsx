import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  CheckCircle2, 
  Compass, 
  Plane, 
  MoonStar, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AITravelAssistantProps {
  onClose?: () => void;
  isFloatingDrawer?: boolean;
  onNavigateTab?: (tab: any) => void;
}

const QUICK_PROMPTS = [
  'Plan a 10-day VIP Umrah trip for a family of 4 from Lagos',
  'What are the visa requirements for a Nigerian traveling to Dubai?',
  'Suggest a 5-day luxury holiday in Zanzibar on a $2,500 budget',
  'What is the Zamzam water allowance and baggage rule on Saudia vs Air Peace?',
  'Build a 3-day business trip itinerary in London departing from Abuja'
];

export const AITravelAssistant: React.FC<AITravelAssistantProps> = ({
  onClose,
  isFloatingDrawer = true,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `### Welcome to Elham Travels AI Concierge
*"Your Journey, Our Priority." — Elham International Limited (RC 7412148)*

I am your dedicated 24/7 AI travel architect. I can assist you with:
- **Tailored Itineraries:** Day-by-day domestic & international holiday plans
- **Umrah & Hajj Guidance:** Haram-view suites, high-speed Haramain train booking tips, and Zamzam regulations
- **Budget Matching:** Finding flights and hotels matching your budget in ₦ (NGN) or $ (USD)
- **Embassy Visa Checklists:** Complete document prep for UK, US, Schengen, UAE, and Saudi Arabia
- **Packing Checklists:** Custom lists for business, leisure, or pilgrimage

How may I assist your travel plans today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am delighted to assist you with your travel inquiry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to get AI concierge response:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Our travel desk is currently receiving high inquiry volumes. Please try again or connect directly with our 24/7 VIP Travel Desk on WhatsApp: +234 810 963 2718.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (raw: string) => {
    // Quick Markdown renderer for bold, lists, and headers
    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return <h4 key={idx} className="text-sm font-bold text-amber-300 mt-2 mb-1">{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="text-base font-extrabold text-amber-300 mt-2 mb-1">{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-amber-400 mt-1">·</span>
                <span>{line.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
              </div>
            );
          }
          if (line.match(/^\d+\.\s/)) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-amber-400 font-bold">{line.match(/^\d+\./)?.[0]}</span>
                <span>{line.replace(/^\d+\.\s+/, '')}</span>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className={`${isFloatingDrawer ? 'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4' : 'w-full'}`}>
      <div className={`bg-slate-900 text-white rounded-none sm:rounded-2xl w-full max-w-xl h-full sm:h-[88vh] shadow-2xl border border-slate-800 flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">ELHAM TRAVELS AI CONCIERGE</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-medium">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official AI Travel Advisory · Elham International Limited
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Accuracy and Compliance Notice */}
        <div className="bg-slate-950/40 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1 text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Honest booking distinction: Confirmed tickets require verified checkout.</span>
          </span>
          <span className="text-slate-500">IATA Affiliate</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    isUser
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-amber-400 border border-slate-700'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    isUser
                      ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none text-xs'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                  }`}
                >
                  {isUser ? <p>{m.text}</p> : renderFormattedText(m.text)}
                  <span
                    className={`text-[9px] block text-right mt-1.5 ${
                      isUser ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-slate-800/90 text-slate-400 border border-slate-700/80 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-2">
                <span>Curating itinerary & flight options...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Strip */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Suggested Consultations:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything: Umrah packages, flight baggage rules, hotel recommendations..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
