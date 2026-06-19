import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { UR_HOUSE_SYMBOL } from '../../constants/figures.js';
import { Box, Text, useAnimationFrame } from '../../ink.js';
import { getInitialSettings } from '../../utils/settings/settings.js';
import { hueToRgb, toRGBColor } from '../Spinner/utils.js';

const SWEEP_DURATION_MS = 1500;
const SWEEP_COUNT = 2;
const TOTAL_ANIMATION_MS = SWEEP_DURATION_MS * SWEEP_COUNT;
const SETTLED_GREY = toRGBColor({
  r: 153,
  g: 153,
  b: 153
});

const BUILD_FRAMES = ['_', '⎕', '⌂'];

export function AnimatedHouse({
  char = UR_HOUSE_SYMBOL
}: {
  char?: string;
}): React.ReactNode {
  const [reducedMotion] = useState(() => getInitialSettings().prefersReducedMotion ?? false);
  const [done, setDone] = useState(reducedMotion);
  const startTimeRef = useRef<number | null>(null);
  const [ref, time] = useAnimationFrame(done ? null : 150);

  useEffect(() => {
    if (done) return;
    const t = setTimeout(setDone, TOTAL_ANIMATION_MS, true);
    return () => clearTimeout(t);
  }, [done]);

  if (done) {
    return <Box ref={ref}>
        <Text color={SETTLED_GREY}>{char}</Text>
      </Box>;
  }

  if (startTimeRef.current === null) {
    startTimeRef.current = time;
  }
  const elapsed = time - startTimeRef.current;
  const frameIndex = Math.floor(elapsed / 250) % BUILD_FRAMES.length;
  const currentFrame = char === UR_HOUSE_SYMBOL ? BUILD_FRAMES[frameIndex] : char;
  const hue = (elapsed / SWEEP_DURATION_MS * 360) % 360;

  return <Box ref={ref}>
      <Text color={toRGBColor(hueToRgb(hue))}>{currentFrame}</Text>
    </Box>;
}