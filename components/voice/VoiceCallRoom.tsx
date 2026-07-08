'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, Clock, User, Radio, Loader2, Copy, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useVoiceCall } from '@/hooks/useVoiceCall';
import { CallStatus } from '@/types';

interface VoiceCallRoomProps {
  maxDuration?: number; // in seconds, default 300 (5 minutes)
  onEnd?: () => void;
}

export default function VoiceCallRoom({
  maxDuration = 300,
  onEnd,
}: VoiceCallRoomProps) {
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  const [audioLevel, setAudioLevel] = useState(0);
  const [partnerId, setPartnerId] = useState('');
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    status,
    myPeerId,
    isMuted,
    localStream,
    error,
    callPeer,
    endCall,
    toggleMute,
    reset,
  } = useVoiceCall({
    onPartnerLeft: () => {
      setTimeLeft(0);
    },
  });

  // Timer countdown while connected
  useEffect(() => {
    if (status === 'connected' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleEndCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, timeLeft]);

  // Audio level visualization (only when in call)
  useEffect(() => {
    if (!localStream || status !== 'connected') return;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioCtx();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(localStream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 128);
    };

    const interval = setInterval(updateLevel, 50);

    return () => {
      clearInterval(interval);
      audioContext.close();
    };
  }, [localStream, status]);

  const handleEndCall = useCallback(() => {
    endCall();
    setTimeLeft(maxDuration);
    if (onEnd) onEnd();
  }, [endCall, onEnd, maxDuration]);

  const handleStartCall = () => {
    if (!partnerId.trim()) return;
    callPeer(partnerId.trim());
  };

  const handleTryAgain = () => {
    reset();
    setTimeLeft(maxDuration);
    setPartnerId('');
  };

  const handleCopyPeerId = async () => {
    if (!myPeerId) return;
    try {
      await navigator.clipboard.writeText(myPeerId);
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = (s: CallStatus) => {
    switch (s) {
      case 'idle':
        return 'Sẵn sàng';
      case 'matching':
        return 'Đang tìm người...';
      case 'connecting':
        return 'Đang kết nối...';
      case 'connected':
        return 'Đã kết nối';
      case 'ended':
        return 'Cuộc gọi kết thúc';
      default:
        return '';
    }
  };

  const getStatusColor = (s: CallStatus) => {
    switch (s) {
      case 'idle':
        return 'bg-gray-100 text-gray-600';
      case 'matching':
        return 'bg-amber-100 text-amber-700';
      case 'connecting':
        return 'bg-blue-100 text-blue-700';
      case 'connected':
        return 'bg-emerald-100 text-emerald-700';
      case 'ended':
        return 'bg-red-100 text-red-700';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {/* Idle State — share your ID, paste partner's ID */}
        {status === 'idle' && !error && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Radio className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-xl font-display font-bold text-[var(--echo-ink)] mb-2">
                  Gọi thoại ẩn danh
                </h2>
                <p className="text-sm text-[var(--echo-ink-muted)]">
                  Kết nối với người lạ qua giọng nói. Tự động kết thúc sau 5 phút.
                </p>
              </div>

              {/* My Peer ID */}
              <div className="mb-5 p-4 bg-[var(--echo-cream)]/50 rounded-xl">
                <div className="text-xs font-medium text-[var(--echo-ink-muted)] mb-2">
                  ID của bạn — gửi cho người bạn muốn gọi:
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white rounded-lg text-xs font-mono text-[var(--echo-ink)] border border-[var(--echo-parchment)] truncate">
                    {myPeerId || 'Đang tạo ID...'}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyPeerId}
                    disabled={!myPeerId}
                    className="p-2 rounded-lg bg-white border border-[var(--echo-parchment)] hover:bg-[var(--echo-cream)] disabled:opacity-50 transition-colors"
                    aria-label="Sao chép Peer ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[var(--echo-ink-muted)]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Partner ID Input */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[var(--echo-ink-muted)] mb-2">
                  Nhập Peer ID của người bạn muốn gọi:
                </label>
                <input
                  type="text"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartCall()}
                  placeholder="vd: abc123xyz..."
                  className="w-full h-12 px-4 rounded-xl border-2 border-[var(--echo-parchment)] bg-white text-[var(--echo-ink)] focus:border-[var(--echo-wood)] focus:outline-none transition-colors font-mono text-sm placeholder:text-[var(--echo-ink-muted)] placeholder:font-sans"
                />
              </div>

              <div className="mb-5 p-3 bg-[var(--echo-cream)]/30 rounded-xl">
                <div className="flex items-center justify-center gap-6 text-xs text-[var(--echo-ink-muted)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>5 phút</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Âm thanh</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleStartCall} fullWidth size="lg" disabled={!myPeerId || !partnerId.trim()}>
                <Phone className="w-5 h-5" />
                Bắt đầu cuộc gọi
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Connecting State */}
        {status === 'connecting' && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="text-center p-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-xl font-display font-bold text-[var(--echo-ink)] mb-2">
                Đang kết nối...
              </h2>
              <p className="text-sm text-[var(--echo-ink-muted)] mb-6">
                Đang gọi {partnerId.slice(0, 12)}...
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                <span className="text-sm text-[var(--echo-ink-muted)]">
                  Thiết lập kết nối P2P...
                </span>
              </div>

              <Button variant="ghost" onClick={handleEndCall}>
                Hủy
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Connected State */}
        {status === 'connected' && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Badge className={getStatusColor(status)}>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {getStatusText(status)}
                  </span>
                </Badge>

                <div className="flex items-center gap-2 bg-[var(--echo-cream)] px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-[var(--echo-ink-muted)]" />
                  <span className="font-mono text-sm font-medium text-[var(--echo-ink)]">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Avatar & Partner Info */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    scale: isMuted ? 1 : [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isMuted ? 0 : Infinity,
                  }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)] flex items-center justify-center mx-auto mb-4 shadow-xl"
                >
                  <User className="w-14 h-14 text-white" />
                </motion.div>

                <h3 className="text-lg font-display font-bold text-[var(--echo-ink)] mb-1">
                  Người lạ ẩn danh
                </h3>
                <p className="text-sm text-[var(--echo-ink-muted)]">
                  Cuộc trò chuyện của bạn
                </p>
              </div>

              {/* Audio Visualizer */}
              <div className="mb-8 p-4 bg-[var(--echo-cream)]/30 rounded-xl">
                <div className="flex items-center justify-center gap-1 h-12">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-full"
                      transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                      animate={{
                        height: isMuted ? 8 : Math.max(8, audioLevel * 48 + 8),
                      }}
                      style={{
                        height: isMuted ? 8 : Math.max(8, audioLevel * 48 + 8),
                      }}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-[var(--echo-ink-muted)] mt-2">
                  {isMuted ? 'Bạn đang tắt mic' : 'Đang truyền âm thanh...'}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg
                    ${isMuted
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-[var(--echo-cream)] hover:bg-[var(--echo-parchment)] text-[var(--echo-ink)]'
                    }
                  `}
                >
                  {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
                >
                  <PhoneOff className="w-7 h-7" />
                </motion.button>
              </div>

              <p className="text-center text-xs text-[var(--echo-ink-muted)] mt-6">
                Cuộc gọi sẽ tự động kết thúc khi hết thời gian
              </p>
            </Card>
          </motion.div>
        )}

        {/* Ended State */}
        {status === 'ended' && (
          <motion.div
            key="ended"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="text-center p-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mx-auto mb-4">
                <PhoneOff className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-xl font-display font-bold text-[var(--echo-ink)] mb-2">
                {timeLeft === 0 ? 'Cuộc gọi đã kết thúc' : 'Cuộc trò chuyện kết thúc'}
              </h2>
              <p className="text-sm text-[var(--echo-ink-muted)] mb-6">
                {timeLeft === 0
                  ? 'Đã hết thời gian 5 phút'
                  : 'Cảm ơn bạn đã tham gia. Hẹn gặp lại!'
                }
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-[var(--echo-ink-muted)]" />
                <span className="text-sm text-[var(--echo-ink-muted)]">
                  Thời gian: {formatTime(maxDuration - timeLeft)}
                </span>
              </div>

              <div className="space-y-3">
                <Button onClick={handleTryAgain} fullWidth>
                  <Phone className="w-5 h-5" />
                  Gọi lại
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Error State */}
        {error && status !== 'ended' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="text-center p-6 border-red-200 bg-red-50">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MicOff className="w-8 h-8 text-red-500" />
              </div>

              <h2 className="text-lg font-display font-bold text-red-700 mb-2">
                Không thể kết nối
              </h2>
              <p className="text-sm text-red-600 mb-6">{error}</p>

              <Button onClick={handleTryAgain} fullWidth>
                Thử lại
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}