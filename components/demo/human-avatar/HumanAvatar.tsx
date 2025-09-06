import { RefObject, useEffect, useState, useRef } from 'react';

import { renderHumanAvatar } from './human-avatar-render';

import useFace from '../../../hooks/demo/use-face';
import useHover from '../../../hooks/demo/use-hover';
import useTilt from '../../../hooks/demo/use-tilt';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';

// Minimum volume level that indicates audio output is occurring
const AUDIO_OUTPUT_DETECTION_THRESHOLD = 0.05;

// Amount of delay between end of audio output and setting talking state to false
const TALKING_STATE_COOLDOWN_MS = 2000;

type HumanAvatarProps = {
  /** The canvas element on which to render the avatar. */
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** The radius of the avatar. */
  radius?: number;
  /** The color of the avatar. */
  color?: string;
  /** Gender of the avatar */
  gender?: 'male' | 'female';
};

export default function HumanAvatar({
  canvasRef,
  radius = 250,
  color,
  gender = 'male',
}: HumanAvatarProps) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Audio output volume
  const { volume } = useLiveAPIContext();

  // Talking state
  const [isTalking, setIsTalking] = useState(false);

  const [scale, setScale] = useState(0.1);

  // Face state
  const { eyeScale, mouthScale } = useFace();
  const hoverPosition = useHover();
  const tiltAngle = useTilt({
    maxAngle: 3,
    speed: 0.05,
    isActive: isTalking,
  });

  useEffect(() => {
    function calculateScale() {
      setScale(Math.min(window.innerWidth, window.innerHeight) / 1000);
    }
    window.addEventListener('resize', calculateScale);
    calculateScale();
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Detect whether the agent is talking based on audio output volume
  // Set talking state when volume is detected
  useEffect(() => {
    if (volume > AUDIO_OUTPUT_DETECTION_THRESHOLD) {
      setIsTalking(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Enforce a slight delay between end of audio output and setting talking state to false
      timeoutRef.current = setTimeout(
        () => setIsTalking(false),
        TALKING_STATE_COOLDOWN_MS
      );
    }
  }, [volume]);

  // Render the avatar on the canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')!;
    renderHumanAvatar({ ctx, mouthScale, eyeScale, color, gender, isTalking });
  }, [canvasRef, volume, eyeScale, mouthScale, color, scale, gender, isTalking]);

  return (
    <canvas
      className="human-avatar"
      ref={canvasRef}
      width={radius * 2 * scale}
      height={radius * 2 * scale}
      style={{
        display: 'block',
        borderRadius: '50%',
        transform: `translateY(${hoverPosition}px) rotate(${tiltAngle}deg)`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    />
  );
}