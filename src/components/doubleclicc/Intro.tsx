import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { B, BrandBridge, smooth } from "./brand";
import { slashWipe } from "./SlashWipe";
import { Revenue } from "./scenes/Revenue";
import { Gaps } from "./scenes/Gaps";
import { Connected } from "./scenes/Connected";
import { Method } from "./scenes/Method";
import { Outcome } from "./scenes/Outcome";
export const Intro = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: B.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="01 / Revenue slipping through the gaps"
          durationInFrames={162}
          premountFor={fps}
        >
          <Revenue />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slashWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="02 / Trace the friction"
          durationInFrames={162}
          premountFor={fps}
        >
          <Gaps />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slashWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="03 / Connect the work"
          durationInFrames={162}
          premountFor={fps}
        >
          <Connected />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slashWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="04 / Fix what matters"
          durationInFrames={162}
          premountFor={fps}
        >
          <Method />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slashWipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="05 / Less busywork, more revenue"
          durationInFrames={162}
          premountFor={fps}
        >
          <Outcome />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {frame < 27 && (
        <BrandBridge progress={interpolate(frame, [5, 27], [1, 0], smooth)} />
      )}
      {frame > 728 && (
        <BrandBridge
          progress={interpolate(frame, [728, 747], [0, 1], smooth)}
        />
      )}
    </AbsoluteFill>
  );
};
