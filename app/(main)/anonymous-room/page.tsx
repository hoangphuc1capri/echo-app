'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, MicOff, Send, X, Clock, Shield, User, Heart, Sparkles, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Message {
  id: string;
  sender: 'me' | 'partner';
  content: string;
  timestamp: Date;
}

export default function AnonymousRoomPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  useEffect(() => {
    if (isConnected && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected, timeLeft]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartSession = () => {
    setIsWaiting(true);
    setTimeout(() => {
      setIsWaiting(false);
      setIsConnected(true);
      setMessages([
        {
          id: '1',
          sender: 'partner',
          content: 'Chào bạn! Mình cũng đang trải qua những cảm xúc giống bạn. Bạn muốn chia sẻ điều gì?',
          timestamp: new Date(),
        },
      ]);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'me',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');

    setTimeout(() => {
      const responses = [
        'Mình hiểu cảm giác đó. Điều đó cũng từng xảy ra với mình.',
        'Cảm ơn bạn đã chia sẻ. Bạn có muốn nói thêm không?',
        'Mình nghĩ bạn đang làm tốt đấy. Hãy tiếp tục cố gắng!',
        'Thật sự thì mình cũng từng như vậy. Bạn không cô đơn đâu.',
      ];
      const partnerMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'partner',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, partnerMessage]);
    }, 1500);
  };

  const handleEndSession = () => {
    setIsConnected(false);
    setIsWaiting(false);
    setMessages([]);
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-[var(--echo-ink-muted)]">
          <a href="/dashboard" className="hover:text-[var(--echo-wood)]">Trang chủ</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--echo-ink)]">Phòng gọi ẩn danh</span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-ink)]">
          Phòng trò chuyện ẩn danh
        </h1>
        <p className="text-[var(--echo-ink-muted)] mt-2">
          Kết nối với những người cùng cảm xúc. An toàn và tôn trọng.
        </p>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8 max-w-xl mx-auto"
      >
        <Card className="text-center">
          <Shield className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-[var(--echo-ink)]">Ẩn danh</div>
        </Card>
        <Card className="text-center">
          <Clock className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-[var(--echo-ink)]">5 phút</div>
        </Card>
        <Card className="text-center">
          <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-[var(--echo-ink)]">Lắng nghe</div>
        </Card>
      </motion.div>

      {/* Main Content */}
      {!isConnected && !isWaiting ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <Card className="overflow-hidden">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--echo-cream)] to-[var(--echo-parchment)] flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-[var(--echo-wood)]" />
              </div>
              <h2 className="text-xl font-display font-bold text-[var(--echo-ink)] mb-2">
                Bắt đầu cuộc trò chuyện
              </h2>
              <p className="text-sm text-[var(--echo-ink-muted)]">
                Kết nối với người lạ ẩn danh
              </p>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--echo-ink-muted)] mb-3 text-center">
                Chọn hình thức
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('text')}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${mode === 'text'
                      ? 'border-[var(--echo-wood)] bg-[var(--echo-wood)]/5'
                      : 'border-[var(--echo-parchment)] hover:border-[var(--echo-wood)]/50'}
                  `}
                >
                  <MessageCircle className={`w-8 h-8 ${mode === 'text' ? 'text-[var(--echo-wood)]' : 'text-[var(--echo-ink-muted)]'}`} />
                  <span className={`text-sm font-medium ${mode === 'text' ? 'text-[var(--echo-wood)]' : 'text-[var(--echo-ink)]'}`}>
                    Nhắn tin
                  </span>
                </button>
                <button
                  onClick={() => setMode('voice')}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${mode === 'voice'
                      ? 'border-[var(--echo-wood)] bg-[var(--echo-wood)]/5'
                      : 'border-[var(--echo-parchment)] hover:border-[var(--echo-wood)]/50'}
                  `}
                >
                  <Mic className={`w-8 h-8 ${mode === 'voice' ? 'text-[var(--echo-wood)]' : 'text-[var(--echo-ink-muted)]'}`} />
                  <span className={`text-sm font-medium ${mode === 'voice' ? 'text-[var(--echo-wood)]' : 'text-[var(--echo-ink)]'}`}>
                    Giọng nói
                  </span>
                </button>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mb-6 p-4 bg-[var(--echo-cream)]/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[var(--echo-wood)]" />
                <span className="text-sm font-medium text-[var(--echo-ink)]">Lưu ý</span>
              </div>
              <ul className="text-sm text-[var(--echo-ink-muted)] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--echo-wood)] mt-0.5">•</span>
                  Tự động kết thúc sau 5 phút
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--echo-wood)] mt-0.5">•</span>
                  Không lưu lại lịch sử
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--echo-wood)] mt-0.5">•</span>
                  Tôn trọng và lắng nghe
                </li>
              </ul>
            </div>

            <Button onClick={handleStartSession} fullWidth>
              <Sparkles className="w-5 h-5" />
              Tìm người trò chuyện
            </Button>
          </Card>
        </motion.div>
      ) : isWaiting ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <Card className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-4 border-[var(--echo-wood)] border-t-transparent mx-auto mb-6"
            />
            <h2 className="text-xl font-display font-bold text-[var(--echo-ink)] mb-2">
              Đang tìm người phù hợp...
            </h2>
            <p className="text-[var(--echo-ink-muted)] mb-6">
              Vui lòng chờ trong giây lát
            </p>
            <Button variant="ghost" onClick={() => setIsWaiting(false)}>
              Hủy bỏ
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden p-0">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--echo-parchment)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)] flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-[var(--echo-ink)]">Người lạ ẩn danh</div>
                  <div className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Đang kết nối
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[var(--echo-cream)] px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-[var(--echo-ink-muted)]" />
                  <span className="font-mono text-sm font-medium">{formatTime(timeLeft)}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleEndSession} className="text-red-500 hover:bg-red-50">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[85%] px-5 py-3 rounded-2xl
                        ${msg.sender === 'me'
                          ? 'bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)] text-white rounded-br-sm'
                          : 'bg-white text-[var(--echo-ink)] rounded-bl-sm border border-[var(--echo-parchment)]'}
                      `}
                    >
                      <p className="font-body text-[15px] leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--echo-parchment)] bg-[var(--echo-cream)]/30">
              {mode === 'voice' ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Button
                    variant={isMuted ? 'danger' : 'primary'}
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full w-20 h-20 p-0"
                  >
                    {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>
                  <p className="text-sm text-[var(--echo-ink-muted)]">
                    {isMuted ? 'Đang tắt mic' : 'Nhấn để nói'}
                  </p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow h-12 px-4 rounded-xl border-2 border-[var(--echo-parchment)] bg-white text-[var(--echo-ink)] focus:border-[var(--echo-wood)] focus:outline-none transition-colors font-ui placeholder:text-[var(--echo-ink-muted)]"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={handleEndSession} className="text-[var(--echo-ink-muted)]">
              Kết thúc cuộc trò chuyện
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
