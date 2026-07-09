import { useRef, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useSoundEffects() {
  const [isEnabled, setIsEnabled] = useLocalStorage('roleta_sound_enabled', true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  };

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.3) => {
    if (!isEnabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch { /* silently ignore */ }
  }, [isEnabled]);

  const playTickSound = useCallback(() => {
    playTone(800, 0.05, 'square', 0.15);
  }, [playTone]);

  const playSpinSound = useCallback((speed: number) => {
    // speed 0.1 (slow) to 1.0 (fast)
    const freq = 200 + speed * 400;
    playTone(freq, 0.1, 'sawtooth', 0.2);
  }, [playTone]);

  const playWinSound = useCallback(() => {
    if (!isEnabled) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.4), i * 120);
    });
  }, [isEnabled, playTone]);

  const playNoWinSound = useCallback(() => {
    playTone(220, 0.4, 'sine', 0.2);
  }, [playTone]);

  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, [setIsEnabled]);

  return { playTickSound, playSpinSound, playWinSound, playNoWinSound, isEnabled, toggleSound };
}
