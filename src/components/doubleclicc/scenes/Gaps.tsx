import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  Shell,
  Line,
  Label,
  Dot,
  mono,
  smooth,
  useBrandLayout,
} from "../brand";
const GapRow = ({
  label,
  status,
  index,
}: {
  label: string;
  status: string;
  index: number;
}) => {
  const f = useCurrentFrame();
  const { mobile } = useBrandLayout();
  const d = 15 + index * 21;
  const active = Math.floor(Math.max(0, f - 24) / 34) % 3 === index;
  return (
    <div
      style={{
        position: "relative",
        height: mobile ? 200 : 157,
        borderTop: `1px solid ${B.line}`,
        display: "flex",
        alignItems: mobile ? "flex-start" : "center",
        paddingTop: mobile ? 32 : 0,
        boxSizing: "border-box",
        opacity: interpolate(f, [d, d + 20], [0, 1], smooth),
        translate: `${interpolate(f, [d, d + 25], [40, 0], smooth)}px 0`,
      }}
    >
      <span
        style={{
          ...mono,
          color: active ? B.amber : B.quiet,
          fontSize: mobile ? 30 : 23,
          lineHeight: mobile ? "74px" : undefined,
          width: mobile ? 80 : 90,
        }}
      >
        0{index + 1}
      </span>
      <span style={{ fontSize: mobile ? 64 : 68, letterSpacing: -2.5 }}>
        {label}
      </span>
      <div
        style={{
          position: "absolute",
          left: mobile ? 480 : 870,
          width: mobile ? 472 : 470,
          top: mobile ? 148 : undefined,
          height: 1,
          background: B.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: mobile
            ? 500 + ((f * 4 + index * 75) % 400)
            : 980 + ((f * 4 + index * 75) % 280),
          top: mobile ? 147 : undefined,
          width: 30,
          height: 2,
          background: B.amber,
          opacity: 0.65,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: mobile ? undefined : 0,
          left: mobile ? 80 : undefined,
          top: mobile ? 130 : undefined,
          color: active ? B.amber : B.quiet,
          ...mono,
          fontSize: mobile ? 28 : 20,
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <Dot color={active ? B.amber : B.quiet} />
        {status}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: active ? (mobile ? 952 : 1688) : 0,
          height: 1,
          background: `${B.amber}60`,
        }}
      />
    </div>
  );
};
export const Gaps = () => {
  const { mobile } = useBrandLayout();
  return (
    <Shell chapter="02 / TRACE THE FRICTION" status="CONSTRAINTS DETECTED" warm>
      <Label
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          top: mobile ? 239 : 227,
          fontSize: mobile ? 30 : 20,
        }}
      >
        FOLLOW THE WORK. FIND THE FRICTION.
      </Label>
      <Line
        delay={5}
        style={{
          position: "absolute",
          left: mobile ? 58 : 112,
          top: mobile ? 316 : 275,
          fontSize: mobile ? 136 : 112,
          lineHeight: mobile ? 1.04 : undefined,
          letterSpacing: -6,
        }}
      >
        The gaps{mobile ? <br /> : " "}add up.
      </Line>
      <div
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          right: mobile ? 64 : 120,
          top: mobile ? 665 : 451,
        }}
      >
        <GapRow label="Slow lead response" status="WAITING" index={0} />
        <GapRow label="Manual follow-up" status="AT RISK" index={1} />
        <GapRow label="Disconnected tools" status="OUT OF SYNC" index={2} />
      </div>
    </Shell>
  );
};
