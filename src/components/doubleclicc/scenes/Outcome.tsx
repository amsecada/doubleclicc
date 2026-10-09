import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  Shell,
  Line,
  Label,
  Slashes,
  smooth,
  mono,
  Dot,
  useBrandLayout,
} from "../brand";
export const Outcome = () => {
  const f = useCurrentFrame();
  const { mobile } = useBrandLayout();
  return (
    <Shell chapter="05 / YOUR NEXT MOVE" status="SYSTEM READY">
      <div
        style={{
          position: "absolute",
          left: mobile ? 540 : 1190,
          top: mobile ? 515 : 204,
          opacity: 0.1,
          rotate: `${interpolate(f, [0, 150], [3, 0], smooth)}deg`,
        }}
      >
        <Slashes size={mobile ? 590 : 690} outline />
      </div>
      <Label
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          top: 228,
          color: B.green,
          fontSize: mobile ? 30 : 20,
        }}
      >
        DOUBLECLICC / REVENUE SYSTEMS
      </Label>
      <div
        style={{
          position: "absolute",
          left: mobile ? 58 : 108,
          top: mobile ? 310 : 324,
          fontSize: mobile ? 148 : 154,
          letterSpacing: mobile ? -8 : -9,
          lineHeight: 1.02,
        }}
      >
        {mobile ? (
          <>
            <Line delay={4}>Less</Line>
            <Line delay={10}>busywork.</Line>
            <Line delay={16} style={{ color: B.green }}>
              More
            </Line>
            <Line delay={22} style={{ color: B.green }}>
              revenue.
            </Line>
          </>
        ) : (
          <>
            <Line delay={4}>Less busywork.</Line>
            <Line delay={16} style={{ color: B.green }}>
              More revenue.
            </Line>
          </>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          right: mobile ? 64 : undefined,
          top: mobile ? 1060 : 761,
          opacity: interpolate(f, [45, 65], [0, 1], smooth),
          translate: `0 ${interpolate(f, [45, 70], [20, 0], smooth)}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: mobile ? 16 : 22,
            fontSize: mobile ? 40 : 42,
            fontWeight: 400,
            color: B.ink,
            border: mobile ? `1px solid ${B.green}70` : undefined,
            background: mobile ? `${B.green}0a` : undefined,
            padding: mobile ? "32px 28px" : undefined,
          }}
        >
          <Dot />
          Start with a Revenue Diagnostic.
          <span
            style={{
              color: B.green,
              fontSize: 46,
              marginLeft: mobile ? "auto" : 25,
            }}
          >
            ↗
          </span>
        </div>
        <div
          style={{
            ...mono,
            fontSize: mobile ? 34 : 28,
            color: B.green,
            marginTop: 34,
          }}
        >
          doublecli.cc
        </div>
      </div>
    </Shell>
  );
};
