import { interpolate, useCurrentFrame } from "remotion";
import {
  B,
  Shell,
  Line,
  Label,
  Slashes,
  mono,
  smooth,
  useBrandLayout,
} from "../brand";
export const Connected = () => {
  const f = useCurrentFrame();
  const { mobile } = useBrandLayout();
  const progress = interpolate(f, [35, 112], [0, 1], smooth);
  return (
    <Shell chapter="03 / CONNECT THE WORK" status="SYSTEMS CONNECTED">
      <Label
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          top: 225,
          color: B.green,
          fontSize: mobile ? 30 : 20,
          lineHeight: mobile ? 1.6 : undefined,
        }}
      >
        AUTOMATION + AI{mobile ? <br /> : " / "}BUILT AROUND YOUR BUSINESS
      </Label>
      <div
        style={{
          position: "absolute",
          left: mobile ? 58 : 112,
          top: mobile ? 352 : 299,
          fontSize: mobile ? 108 : 111,
          lineHeight: 1.07,
          letterSpacing: -6,
        }}
      >
        <Line delay={5}>Connect the work.</Line>
        <Line delay={18} style={{ color: B.green }}>
          Keep revenue{mobile ? <br /> : " "}moving.
        </Line>
      </div>
      <Slashes
        size={mobile ? 420 : 212}
        style={{
          position: "absolute",
          right: mobile ? 64 : 150,
          top: mobile ? 815 : 294,
          opacity: mobile ? 0.09 : 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: mobile ? 128 : 170,
          right: mobile ? 64 : 170,
          top: mobile ? 825 : 719,
          height: mobile ? 420 : 180,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: mobile ? undefined : 0,
            top: 0,
            width: mobile ? 2 : undefined,
            height: mobile ? 420 : 2,
            background: B.line,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: mobile ? 2 : `${progress * 100}%`,
            height: mobile ? progress * 420 : 2,
            background: B.green,
            boxShadow: `0 0 15px ${B.green}55`,
          }}
        />
        {["LEAD", "ROUTE", "QUALIFY", "QUOTE", "FOLLOW UP", "CLOSE"].map(
          (label, i) => {
            const x = i * 316;
            const lit = progress >= i / 5;
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: mobile ? 0 : x,
                  top: mobile ? i * 84 - 32 : -25,
                }}
              >
                <div
                  style={{
                    width: mobile ? 64 : 50,
                    height: mobile ? 64 : 50,
                    translate: mobile ? "-32px 0" : "-25px 0",
                    background: lit ? B.green : B.bg,
                    border: `1px solid ${lit ? B.green : B.quiet}`,
                    boxShadow: lit ? `0 0 38px ${B.green}18` : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: B.bg,
                    fontSize: mobile ? 32 : 24,
                  }}
                >
                  {lit ? "↗" : ""}
                </div>
                <div
                  style={{
                    ...mono,
                    fontSize: mobile ? 34 : 19,
                    position: "absolute",
                    top: mobile ? 10 : 79,
                    left: mobile ? 64 : -85,
                    width: mobile ? 400 : 170,
                    textAlign: mobile ? "left" : "center",
                    color: lit ? B.ink : B.quiet,
                  }}
                >
                  {label}
                </div>
              </div>
            );
          },
        )}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: mobile ? -4 : (f * 8 + i * 520) % 1580,
              top: mobile ? (f * 3 + i * 140) % 420 : -4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: B.green,
              boxShadow: `0 0 15px ${B.green}`,
              opacity: f > 112 ? 1 : 0,
            }}
          />
        ))}
      </div>
    </Shell>
  );
};
