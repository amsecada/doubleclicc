import { AbsoluteFill, Easing, useVideoConfig } from "remotion";
import type { TransitionPresentationComponentProps } from "@remotion/transitions";
import { B } from "./brand";
// The trailing edge reveals the next scene; the two green parallelograms
// keep the brand's // silhouette visible throughout the wipe.
const DoubleSlashWipe = ({
  children,
  presentationProgress,
  presentationDirection,
}: TransitionPresentationComponentProps<Record<string, never>>) => {
  const { width, height } = useVideoConfig();
  const sx = width / 1920;
  const slant = 400 * sx;
  const p = Easing.bezier(0.65, 0, 0.35, 1)(presentationProgress);
  const x = (-700 + p * 3400) * sx;
  const entering = presentationDirection === "entering";
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={
          entering
            ? {
                clipPath: `polygon(0px 0px, ${x}px 0px, ${x - slant}px ${height}px, 0px ${height}px)`,
              }
            : {}
        }
      >
        {children}
      </AbsoluteFill>
      {entering && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}
        >
          <polygon
            points={`${x},0 ${x + 150 * sx},0 ${x - 250 * sx},${height} ${x - slant},${height}`}
            fill={B.green}
          />
          <polygon
            points={`${x + 260 * sx},0 ${x + 410 * sx},0 ${x + 10 * sx},${height} ${x - 140 * sx},${height}`}
            fill={B.green}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
export const slashWipe = () => ({ component: DoubleSlashWipe, props: {} });
