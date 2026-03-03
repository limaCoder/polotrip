import {Composition, Folder} from 'remotion';
import {PolotripReel} from './scenes/PolotripReel';

export const RemotionRoot = () => {
  return (
    <Folder name="Marketing">
      <Composition
        id="PolotripReel"
        component={PolotripReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </Folder>
  );
};
