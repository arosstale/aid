import { Composition, registerRoot } from 'remotion';
import { Presentation } from './Presentation.jsx';
import { SLIDES } from './slides.js';

const SLIDE_DUR = 180; // 6s per slide at 30fps
const TOTAL = SLIDES.length * SLIDE_DUR;

export const RemotionRoot = () => (
  <>
    <Composition
      id="Presentation"
      component={Presentation}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RemotionRoot);
