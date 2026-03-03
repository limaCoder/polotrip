import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

type TravellerBearProps = {
  x: number;
  y: number;
  scale?: number;
};

export const TravellerBear = ({x, y, scale = 1}: TravellerBearProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bounce = Math.sin(frame / 4) * 8;
  const step = Math.sin((frame / fps) * Math.PI * 4);
  const wave = spring({
    frame,
    fps,
    config: {damping: 14, stiffness: 120},
    durationInFrames: 45,
  });

  return (
    <svg
      viewBox="0 0 360 360"
      style={{
        position: 'absolute',
        left: x,
        top: y + bounce,
        width: 360 * scale,
        height: 360 * scale,
      }}
    >
      <ellipse cx="178" cy="325" rx="105" ry="20" fill="rgba(0,0,0,0.2)" />
      <g>
        <circle cx="118" cy="92" r="34" fill="#7A4B2F" />
        <circle cx="242" cy="92" r="34" fill="#7A4B2F" />
        <circle cx="180" cy="120" r="105" fill="#8E5A3A" />
        <ellipse cx="180" cy="148" rx="62" ry="52" fill="#F4D8B6" />

        <circle cx="146" cy="120" r="10" fill="#232323" />
        <circle cx="214" cy="120" r="10" fill="#232323" />
        <ellipse cx="180" cy="146" rx="10" ry="8" fill="#232323" />
        <path d="M170 160 Q180 172 190 160" stroke="#232323" strokeWidth="5" fill="none" strokeLinecap="round" />

        <rect x="120" y="210" width="120" height="95" rx="40" fill="#8E5A3A" />

        <g style={{transform: `translate(96px, 220px) rotate(${step * 16}deg)`, transformOrigin: '30px 30px'}}>
          <circle cx="30" cy="30" r="26" fill="#7A4B2F" />
        </g>

        <g style={{transform: `translate(236px, 208px) rotate(${(-25 + wave * 40).toFixed(2)}deg)`, transformOrigin: '20px 40px'}}>
          <rect x="0" y="0" width="40" height="85" rx="18" fill="#7A4B2F" />
          <circle cx="20" cy="86" r="18" fill="#7A4B2F" />
        </g>

        <g style={{transform: `translate(138px, 288px) translateY(${step * 5}px)`}}>
          <ellipse cx="24" cy="24" rx="25" ry="20" fill="#7A4B2F" />
          <ellipse cx="94" cy="24" rx="25" ry="20" fill="#7A4B2F" />
        </g>

        <g style={{transform: 'translate(218px, 198px) rotate(-18deg)'}}>
          <rect x="0" y="0" width="82" height="112" rx="14" fill="#F8A23D" />
          <rect x="8" y="12" width="66" height="84" rx="10" fill="#FEB85F" />
          <rect x="25" y="-16" width="30" height="20" rx="8" fill="#D7852A" />
        </g>

        <g style={{transform: 'translate(126px, 206px) rotate(-8deg)'}}>
          <rect x="0" y="0" width="108" height="72" rx="12" fill="#F7F7F7" stroke="#E5E5E5" strokeWidth="3" />
          <path d="M8 8 L100 8 L54 38 Z" fill="#DFF3FF" />
          <circle cx="88" cy="52" r="8" fill="#4E9FFF" />
        </g>
      </g>
    </svg>
  );
};
