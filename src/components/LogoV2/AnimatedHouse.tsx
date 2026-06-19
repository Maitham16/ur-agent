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
  return <Text color={SETTLED_GREY}>{char}</Text>;
}