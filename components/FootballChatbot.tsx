'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FootballChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'يا هلا بيك يا كابتن! أنا حريف EDGE، اسألني عن أي ماتش، إحصائية، أو تاريخ أي بطولة وأنا معاك ⚽🔥' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'حصل دروب في الشبكة، اسألني تاني كده!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" dir="rtl">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-4 rounded-full shadow-2xl transition transform hover:scale-105 flex items-center gap-2 font-bold"
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs hidden sm:inline">اسأل حريف EDGE</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] sm:w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">حريف EDGE</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Gemini AI Active</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">
                    E
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-400">
                <span className="animate-pulse">حريف EDGE بيكتب...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اسأل عن أي فريق، لاعب، أو بطولة..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 p-2.5 rounded-xl transition"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}