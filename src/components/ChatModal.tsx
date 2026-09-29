import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, MapPin, User as UserIcon } from 'lucide-react';
import { ChatMessage, ExchangeRecord, RequestItem } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  threadId: string; // requestId or exchangeId
  itemTitle: string;
  counterpartName: string;
  counterpartDistrict?: string;
  counterpartCity?: string;
  recipientId: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  threadId,
  itemTitle,
  counterpartName,
  counterpartDistrict = 'Tamil Nadu',
  counterpartCity = '',
  recipientId
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.getMessages(threadId);
      setMessages(res.messages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && threadId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      setIsSending(true);
      const res = await api.sendMessage({
        requestId: threadId,
        exchangeId: threadId,
        recipientId,
        content: newMessage.trim()
      });
      setMessages(prev => [...prev, res.message]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[600px] max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm text-white">
              {counterpartName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">{counterpartName}</h4>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <MapPin className="w-3 h-3" />
                <span>{counterpartCity ? `${counterpartCity}, ` : ''}{counterpartDistrict}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety & Item Banner */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-slate-700 truncate max-w-[200px]">Item: {itemTitle}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-800 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Public Meetups Only</span>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <p className="text-xs font-medium">No messages yet.</p>
              <p className="text-[11px] mt-1 text-slate-500 max-w-xs">
                Say hello, verify item condition, and agree on a convenient public meeting spot in Tamil Nadu!
              </p>
            </div>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {!isMine && (
                      <p className="font-bold text-[10px] text-emerald-700 mb-0.5">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="break-words">{msg.content}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isMine ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={language === 'ta' ? 'செய்தியைத் தட்டச்சு செய்க...' : 'Type a message (e.g. Can meet at Bus Stand at 4pm)...'}
            className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
