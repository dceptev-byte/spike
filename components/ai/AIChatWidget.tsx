'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Sparkles, X, Send, Bot, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { useUIStore } from '@/lib/store/uiStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey there! 👋 I'm **Spike AI**. I can help you manage projects, break down tasks, or answer questions about Spike.\n\nWhat are you working on today?",
  createdAt: new Date(),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Render a message body — handle bold (**text**) and newlines. */
function MessageBody({ content }: { content: string }) {
  // Split on **bold** markers and newlines
  const parts = content.split(/(\*\*[^*]+\*\*|\n)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part === '\n') return <br key={i} />;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        // Handle markdown-style list bullets (lines starting with "- ")
        if (part.startsWith('- ')) {
          return (
            <span key={i} className="block pl-3 before:content-['•'] before:mr-1.5 before:text-current">
              {part.slice(2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ---------------------------------------------------------------------------
// TypingIndicator
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-indigo-600" />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2.5 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AIChatWidget
// ---------------------------------------------------------------------------

export default function AIChatWidget() {
  const isOpen = useUIStore((s) => s.isChatOpen);
  const setIsOpen = useUIStore((s) => s.setChatOpen);
  const toggleChat = useUIStore((s) => s.toggleChat);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({
        role,
        content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: { role: 'assistant'; content: string } = await res.json();

      const assistantMsg: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: data.content,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          content:
            "Sorry, I couldn't reach the AI service right now. Please try again in a moment.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isOpen]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearConversation() {
    setMessages([WELCOME]);
    setInput('');
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Chat panel ── */}
      <div
        className={clsx(
          'fixed bottom-24 right-6 z-50',
          'w-[380px] h-[540px]',
          'bg-white rounded-2xl shadow-2xl border border-gray-200',
          'flex flex-col overflow-hidden',
          'transform transition-all duration-300 ease-out origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none',
        )}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Spike AI</p>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearConversation}
              title="Clear conversation"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title="Close chat"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'flex items-end gap-2',
                msg.role === 'user' && 'flex-row-reverse',
              )}
            >
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              )}

              {/* Bubble */}
              <div
                className={clsx(
                  'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm',
                )}
              >
                <MessageBody content={msg.content} />
              </div>
            </div>
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 px-3 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Spike AI anything… (↵ to send)"
              rows={1}
              disabled={isLoading}
              className={clsx(
                'flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2',
                'text-sm text-gray-900 placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                'transition-colors max-h-28 overflow-y-auto',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={clsx(
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                'bg-indigo-600 text-white',
                'hover:bg-indigo-700 active:scale-95 transition-all',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100',
              )}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">
            Shift+↵ for new line · Mock responses (Anthropic SDK not yet wired)
          </p>
        </div>
      </div>

      {/* ── Floating toggle button ── */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close Spike AI chat' : 'Open Spike AI chat'}
        className={clsx(
          'fixed bottom-6 right-6 z-50',
          'w-14 h-14 rounded-full shadow-lg',
          'flex items-center justify-center',
          'bg-indigo-600 hover:bg-indigo-700 text-white',
          'active:scale-95 transition-all duration-200',
          isOpen && 'rotate-90',
        )}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {/* Unread dot */}
            {hasUnread && (
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white" />
            )}
          </>
        )}
      </button>
    </>
  );
}
