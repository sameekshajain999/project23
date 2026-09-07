import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ChevronDown,
  BookOpen,
  Award,
  FlaskConical,
  ShieldCheck,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    content:
      '**Namaste! I am your AyushSetu AI Career & Regulatory Advisor.**\n\nI am here to help you navigate your Ayush journey—from finding premier industrial internships at Dabur and Himalaya to closing skill gaps like **Schedule T (ASU GMP)**, **GCP-AYUSH**, and **HPTLC fingerprinting**.\n\nHow may I guide your career or clinical residency today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'AyushSetu Advisor',
  },
];

const SUGGESTION_CHIPS = [
  {
    label: 'Closing Schedule T GMP Gap',
    query: 'How can I bridge my Schedule T GMP compliance gap for ASU manufacturing?',
    icon: ShieldCheck,
  },
  {
    label: 'Top ASU Internships',
    query: 'What are the top active internships at Dabur, Himalaya, and Patanjali?',
    icon: Briefcase,
  },
  {
    label: 'HPTLC & HPLC Phytochemistry',
    query: 'How do I master HPTLC marker profiling and extract standardization?',
    icon: FlaskConical,
  },
  {
    label: 'GCP-AYUSH Clinical Trials',
    query: 'What are the GCP-AYUSH protocol requirements for clinical research associates?',
    icon: BookOpen,
  },
  {
    label: 'Rule 158-B Licensing Norms',
    query: 'Explain Rule 158-B licensing requirements for Patent or Proprietary ASU medicines.',
    icon: Award,
  },
];

// Helper to render basic markdown formatting (bold, bullet lists, newlines)
function FormattedContent({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Handle bullet items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1">
              <span className="text-emerald-600 font-bold mt-1 text-xs">•</span>
              <span className="flex-1">
                {parseBoldText(bulletText)}
              </span>
            </div>
          );
        }

        // Handle numbered items
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1">
              <span className="text-emerald-700 font-bold text-xs shrink-0">{numMatch[1]}.</span>
              <span className="flex-1">
                {parseBoldText(numMatch[2])}
              </span>
            </div>
          );
        }

        return <p key={idx}>{parseBoldText(line)}</p>;
      })}
    </div>
  );
}

function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isLoading) return;

    setErrorBanner(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) {
      setInputMessage('');
    }
    setIsLoading(true);

    try {
      // Build conversation history for API
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-msg')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I received your inquiry. How else can I assist your career roadmap?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'AyushSetu Advisor',
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorBanner('Could not retrieve advice from the server. Using local advisory guidance.');
      // Local fallback in case network has an issue
      const fallbackResponse: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content:
          '**Ayush Advisory Note:**\n- For **Schedule T & GMP**, focus on Section 33P of the Drugs & Cosmetics Act and batch manufacturing records (BMR).\n- For **Internships**, review active openings under the Opportunities tab.\n- For **GCP-AYUSH**, complete the 14-day protocol simulation module.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'AyushSetu Fallback Advisor',
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setErrorBanner(null);
  };

  return (
    <>
      {/* Floating Chat Bubble Button at bottom-right corner */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen ? (
          <button
            id="ai-chatbot-open-bubble"
            onClick={() => setIsOpen(true)}
            className="group flex items-center space-x-2.5 px-4 py-3 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-full shadow-xl hover:shadow-2xl border-2 border-amber-400/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-800/80 border border-emerald-400/50">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1B4D3E] rounded-full"></span>
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold tracking-tight text-white flex items-center space-x-1">
                <span>AI Assistant</span>
                <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[9px] font-mono rounded">
                  Gemini
                </span>
              </div>
              <div className="text-[10px] text-emerald-200/90 font-medium">
                Ayush Career Advisor
              </div>
            </div>
          </button>
        ) : null}
      </div>

      {/* Interactive Chat Window / Drawer */}
      {isOpen && (
        <div
          id="ai-chatbot-modal"
          className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[440px] max-w-[460px] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#1B4D3E] to-[#12362b] text-white flex items-center justify-between shadow-xs shrink-0 border-b border-emerald-800">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-xl bg-emerald-800/90 border border-amber-400/50 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-amber-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1B4D3E] rounded-full" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    AyushSetu AI Assistant
                  </h3>
                  <span className="px-1.5 py-0.5 bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold rounded">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200">
                  Career, Skill Gap & Regulatory Advisor
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                id="ai-chatbot-reset-btn"
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                id="ai-chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorBanner && (
            <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
              <span>{errorBanner}</span>
              <button
                onClick={() => setErrorBanner(null)}
                className="text-amber-900 font-bold ml-2 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs ${
                      isUser
                        ? 'bg-slate-700 text-white'
                        : 'bg-[#1B4D3E] text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 shadow-2xs ${
                      isUser
                        ? 'bg-[#1B4D3E] text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    ) : (
                      <FormattedContent text={msg.content} />
                    )}

                    <div
                      className={`mt-1.5 flex items-center justify-between text-[10px] ${
                        isUser ? 'text-emerald-200/80' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.source && (
                        <span className="flex items-center space-x-1 font-mono text-[9px] text-emerald-700 font-medium">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{msg.source}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1B4D3E] text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium italic">
                      Analyzing Ayush regulations & career roadmap...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 pt-2 pb-1.5 bg-white border-t border-slate-100 shrink-0">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <HelpCircle className="w-3 h-3 text-emerald-600" />
              <span>Recommended Topics</span>
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
              {SUGGESTION_CHIPS.map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.query)}
                    disabled={isLoading}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-slate-700 rounded-full text-[11px] font-medium transition-all whitespace-nowrap shrink-0 border border-slate-200 cursor-pointer disabled:opacity-50"
                  >
                    <Icon className="w-3 h-3 text-emerald-700" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                id="ai-chatbot-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about internships, Schedule T, GCP, HPTLC..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                id="ai-chatbot-send-btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 bg-[#1B4D3E] hover:bg-[#153e32] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs active:scale-95"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Ministry of Ayush & AIIA Academic Collaboration Advisor</span>
              <span className="text-emerald-700 font-semibold">Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
