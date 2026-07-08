'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { CallStatus } from '@/types';

interface UseVoiceCallOptions {
  stunServer?: string;
  onPartnerLeft?: () => void;
}

interface UseVoiceCallReturn {
  status: CallStatus;
  myPeerId: string;
  isMuted: boolean;
  isPartnerMuted: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  error: string | null;
  callPeer: (remotePeerId: string) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  reset: () => void;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
];

export function useVoiceCall(options: UseVoiceCallOptions = {}): UseVoiceCallReturn {
  const { stunServer, onPartnerLeft } = options;

  const [status, setStatus] = useState<CallStatus>('idle');
  const [myPeerId, setMyPeerId] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPartnerMuted, setIsPartnerMuted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const partnerLeftCallbackRef = useRef(onPartnerLeft);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const STUN_SERVERS: RTCIceServer[] = stunServer
    ? [{ urls: stunServer }, ...ICE_SERVERS]
    : ICE_SERVERS;

  useEffect(() => {
    partnerLeftCallbackRef.current = onPartnerLeft;
  }, [onPartnerLeft]);

  // Lazily create a hidden <audio> element so remote track can play
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio();
    audio.autoplay = true;
    remoteAudioRef.current = audio;
    return () => {
      audio.pause();
      audio.srcObject = null;
    };
  }, []);

  // Initialize PeerJS (connects to PeerJS Cloud by default — no server needed)
  useEffect(() => {
    const peer = new Peer({ config: { iceServers: STUN_SERVERS } });
    peerRef.current = peer;

    peer.on('open', (id) => {
      console.log('[VoiceCall] PeerJS ready, my id:', id);
      setMyPeerId(id);
    });

    peer.on('error', (err) => {
      console.error('[VoiceCall] PeerJS error:', err);
      const type = (err as { type?: string }).type;
      if (type === 'peer-unavailable') {
        setError('Không tìm thấy người này. Hãy kiểm tra lại Peer ID.');
      } else if (type === 'network' || type === 'server-error' || type === 'socket-error') {
        setError('Không thể kết nối đến signaling server.');
      } else if (type === 'unavailable-id') {
        setError('Peer ID đã bị trùng.');
      } else {
        setError('Đã xảy ra lỗi kết nối.');
      }
      setStatus('ended');
    });

    peer.on('call', async (call) => {
      console.log('[VoiceCall] Incoming call from:', call.peer);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;
        setLocalStream(stream);
        call.answer(stream);
        callRef.current = call;
        setStatus('connecting');

        call.on('stream', (remote) => {
          console.log('[VoiceCall] Got remote stream');
          setRemoteStream(remote);
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remote;
            remoteAudioRef.current.play().catch(console.error);
          }
          setStatus('connected');
        });

        call.on('close', () => {
          console.log('[VoiceCall] Call closed by remote');
          partnerLeftCallbackRef.current?.();
          cleanup();
          setStatus('ended');
        });

        call.on('error', (err) => {
          console.error('[VoiceCall] Call error:', err);
          cleanup();
          setStatus('ended');
        });
      } catch (err) {
        console.error('[VoiceCall] getUserMedia failed:', err);
        setError('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
        setStatus('ended');
      }
    });

    return () => {
      peer.destroy();
      peerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    setIsMuted(false);
    setIsPartnerMuted(false);
  }, []);

  const callPeer = useCallback(async (remotePeerId: string) => {
    const trimmed = remotePeerId.trim();
    if (!trimmed) {
      setError('Vui lòng nhập Peer ID của người bạn muốn gọi.');
      return;
    }
    if (!peerRef.current || peerRef.current.destroyed) {
      setError('Peer chưa sẵn sàng, vui lòng đợi.');
      return;
    }

    setError(null);
    setStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      setLocalStream(stream);

      const call = peerRef.current.call(trimmed, stream);
      callRef.current = call;

      // If the other side never answers, PeerJS fires 'error' with peer-unavailable
      let answered = false;

      call.on('stream', (remote) => {
        answered = true;
        console.log('[VoiceCall] Got remote stream');
        setRemoteStream(remote);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remote;
          remoteAudioRef.current.play().catch(console.error);
        }
        setStatus('connected');
      });

      call.on('close', () => {
        console.log('[VoiceCall] Call closed');
        partnerLeftCallbackRef.current?.();
        cleanup();
        setStatus('ended');
      });

      call.on('error', (err) => {
        console.error('[VoiceCall] Call error:', err);
        if (!answered) {
          setError('Người này không online hoặc không nhận cuộc gọi.');
        }
        cleanup();
        setStatus('ended');
      });
    } catch (err) {
      console.error('[VoiceCall] getUserMedia failed:', err);
      setError('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
      setStatus('ended');
    }
  }, [cleanup]);

  const endCall = useCallback(() => {
    callRef.current?.close();
    callRef.current = null;
    cleanup();
    setStatus('ended');
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setStatus('idle');
    setError(null);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    myPeerId,
    isMuted,
    isPartnerMuted,
    localStream,
    remoteStream,
    error,
    callPeer,
    endCall,
    toggleMute,
    reset,
  };
}