import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  Shell,
  Slashes,
  Line,
  Label,
  smooth,
  useBrandLayout,
} from "../brand";
export const Revenue = () => {
  const f = useCurrentFrame();
  const { mobile } = useBrandLayout();
  return (
    <Shell chapter="01 / FIND THE GAPS" status="DIAGNOSTIC MODE" warm>
      <Label
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          top: 239,
          color: B.amber,
          fontSize: mobile ? 30 : 20,
        }}
      >
        SMALL GAPS. REAL CONSEQUENCES.
      </Label>
      <div
        style={{
          position: "absolute",
          left: mobile ? 58 : 110,
          top: mobile ? 322 : 340,
          fontSize: mobile ? 128 : 122,
          lineHeight: 1.06,
          letterSpacing: -7,
          zIndex: 2,
        }}
      >
        {mobile ? (
          <>
            <Line delay={12}>Your business</Line>
            <Line delay={23} style={{ color: B.amber }}>
              is leaking
            </Line>
            <Line delay={34} style={{ color: B.amber }}>
              revenue.
            </Line>
          </>
        ) : (
          <>
            <Line delay={12}>Your business is</Line>
            <Line delay={23} style={{ color: B.amber }}>
              leaking revenue.
            </Line>
          </>
        )}
      </div>
      <Line
        delay={48}
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          top: mobile ? 802 : 666,
          fontSize: mobile ? 44 : 37,
          fontWeight: 400,
          color: B.muted,
          lineHeight: 1.5,
          width: mobile ? 890 : 1050,
        }}
      >
        Every missed handoff is a missed opportunity.
      </Line>
      <div
        style={{
          position: "absolute",
          left: mobile ? 64 : 1235,
          top: mobile ? 960 : 260,
          width: mobile ? 952 : 570,
          height: mobile ? 290 : 570,
          opacity: interpolate(f, [18, 50], [0, 1], smooth),
        }}
      >
        <Slashes
          size={mobile ? 290 : 540}
          outline
          color={B.amber}
          style={{
            opacity: 0.17,
            position: mobile ? "absolute" : undefined,
            right: mobile ? 60 : undefined,
          }}
        />
        <svg
          width={mobile ? 952 : 600}
          height={mobile ? 290 : 570}
          style={{ position: "absolute", inset: 0 }}
        >
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path
                d={
                  mobile
                    ? `M0 ${40 + i * 90} H${320 + i * 40} M${415 + i * 40} ${40 + i * 90} H945`
                    : `M0 ${130 + i * 135} H${155 + i * 35} M${230 + i * 35} ${130 + i * 135} H570`
                }
                stroke={B.line}
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx={45}
                cy={mobile ? 40 + i * 90 : 130 + i * 135}
                r={7}
                fill={B.green}
              />
              <circle
                cx={mobile ? 940 : 565}
                cy={mobile ? 40 + i * 90 : 130 + i * 135}
                r={7}
                fill={i === 1 ? B.red : B.amber}
              />
              {Array.from({ length: 5 }, (_, j) => {
                const t =
                  (f * (mobile ? 4.2 : 2.8) +
                    j * (mobile ? 170 : 80) +
                    i * 31) %
                  (mobile ? 920 : 540);
                const gap = mobile ? 320 + i * 40 : 155 + i * 35;
                const leaking = t > gap && t < gap + 150;
                return (
                  <circle
                    key={j}
                    cx={leaking ? gap + 14 : t}
                    cy={
                      (mobile ? 40 + i * 90 : 130 + i * 135) +
                      (leaking ? (t - gap) * (mobile ? 0.65 : 1.45) : 0)
                    }
                    r={mobile ? 5 : 3.5}
                    fill={leaking ? B.amber : B.green}
                    opacity={leaking ? Math.max(0, 1 - (t - gap) / 150) : 0.65}
                  />
                );
              })}
            </g>
          ))}
        </svg>
        <Label
          style={{
            position: "absolute",
            left: mobile ? 160 : 100,
            bottom: -17,
            fontSize: mobile ? 28 : 17,
          }}
        >
          LEAD → HANDOFF → REVENUE
        </Label>
      </div>
    </Shell>
  );
};
