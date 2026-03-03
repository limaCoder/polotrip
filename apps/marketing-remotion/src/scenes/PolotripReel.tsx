import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TravellerBear} from '../components/TravellerBear';

const bg = 'linear-gradient(160deg, #0b1022 0%, #11295a 40%, #173f8c 100%)';

const Headline = ({text}: {text: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 35, config: {damping: 16}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 120,
        left: 70,
        right: 70,
        color: 'white',
        fontWeight: 800,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 88,
        lineHeight: 1,
        letterSpacing: -2,
        transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px)`,
        opacity: enter,
        textShadow: '0 12px 30px rgba(0,0,0,0.35)',
      }}
    >
      {text}
    </div>
  );
};

const FloatingCard = ({src, idx}: {src: string; idx: number}) => {
  const frame = useCurrentFrame();
  const baseX = 100 + idx * 290;
  const y = 720 + Math.sin((frame + idx * 14) / 18) * 18;
  const rotate = Math.sin((frame + idx * 12) / 20) * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: baseX,
        top: y,
        width: 250,
        height: 330,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
        transform: `rotate(${rotate}deg)`,
        border: '4px solid rgba(255,255,255,0.17)',
      }}
    >
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
  );
};

const HookScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({frame, fps, durationInFrames: 28});

  return (
    <AbsoluteFill style={{background: bg}}>
      <Headline text={'Viaje \ncom energia'} />
      <TravellerBear x={340 + frame * 2.5} y={790} scale={1.1} />
      <Img
        src={staticFile('polotrip-assets/brand/logo.svg')}
        style={{
          position: 'absolute',
          width: 360,
          left: 70,
          bottom: 140,
          opacity: logoIn,
          transform: `translateY(${interpolate(logoIn, [0, 1], [30, 0])}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const BurstScene = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 7) * 0.03;

  return (
    <AbsoluteFill style={{background: bg}}>
      <Headline text={'Seu álbum,\nsem tédio'} />
      <FloatingCard src={staticFile('polotrip-assets/dashboard/cancun.jpg')} idx={0} />
      <FloatingCard src={staticFile('polotrip-assets/dashboard/paris.jpg')} idx={1} />
      <FloatingCard src={staticFile('polotrip-assets/dashboard/tailandia.jpg')} idx={2} />
      <div
        style={{
          position: 'absolute',
          right: 90,
          top: 220,
          width: 132,
          height: 132,
          borderRadius: 40,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${pulse})`,
        }}
      >
        <Img src={staticFile('polotrip-assets/brand/polotrip-icon.png')} style={{width: 90, height: 90}} />
      </div>
      <TravellerBear x={660} y={1210} scale={0.9} />
      <Img
        src={staticFile('polotrip-assets/brand/traveller-bear.svg')}
        style={{
          position: 'absolute',
          left: 80,
          top: 1220,
          width: 180,
          opacity: 0.85,
          transform: `translateY(${Math.sin(frame / 6) * 8}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const ValueScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const points = ['Timeline inteligente', 'Mapa interativo', 'Compartilhe em 1 link'];

  return (
    <AbsoluteFill style={{background: bg}}>
      <Headline text={'Polotrip\nresolve'} />
      <Img
        src={staticFile('polotrip-assets/album/album-cover.jpg')}
        style={{
          position: 'absolute',
          right: 80,
          top: 420,
          width: 360,
          height: 440,
          objectFit: 'cover',
          borderRadius: 24,
          border: '4px solid rgba(255,255,255,0.2)',
        }}
      />
      {points.map((p, idx) => {
        const delay = idx * 14;
        const pop = spring({frame: frame - delay, fps, durationInFrames: 32, config: {damping: 13}});
        return (
          <div
            key={p}
            style={{
              position: 'absolute',
              left: 70,
              top: 520 + idx * 150,
              background: 'rgba(255,255,255,0.13)',
              color: 'white',
              padding: '22px 26px',
              borderRadius: 20,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 44,
              fontWeight: 700,
              transform: `translateX(${interpolate(pop, [0, 1], [-80, 0])}px)`,
              opacity: pop,
            }}
          >
            {p}
          </div>
        );
      })}
      <TravellerBear x={710} y={1380} scale={0.75} />
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, durationInFrames: 36, config: {damping: 12}});

  return (
    <AbsoluteFill style={{background: bg, justifyContent: 'center', alignItems: 'center'}}>
      <Img src={staticFile('polotrip-assets/brand/logo.svg')} style={{width: 480, marginBottom: 46}} />
      <div
        style={{
          color: 'white',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 84,
          letterSpacing: -2,
          textAlign: 'center',
          transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})`,
          opacity: pop,
        }}
      >
        Crie seu álbum
        <br />
        hoje ✈️
      </div>
      <TravellerBear x={350} y={1230} scale={1.05} />
    </AbsoluteFill>
  );
};

export const PolotripReel = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 12})} />

      <TransitionSeries.Sequence durationInFrames={120}>
        <BurstScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 12})} />

      <TransitionSeries.Sequence durationInFrames={120}>
        <ValueScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 10})} />

      <TransitionSeries.Sequence durationInFrames={120}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
