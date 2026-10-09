import { interpolate, useCurrentFrame } from "remotion";
import { B, Shell, Line, Label, mono, smooth, useBrandLayout } from "../brand";
export const Method = () => {
  const f = useCurrentFrame();
  const { mobile } = useBrandLayout();
  const progress = interpolate(f, [30, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Shell
      chapter="04 / BUILT TO MAKE A DIFFERENCE"
      status="A CLEAR PATH FORWARD"
    >
      <Label
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          top: 237,
          fontSize: mobile ? 30 : 20,
        }}
      >
        NO AUTOMATION FOR ITS OWN SAKE.
      </Label>
      <Line
        delay={7}
        style={{
          position: "absolute",
          left: mobile ? 58 : 112,
          top: mobile ? 317 : 301,
          fontSize: mobile ? 132 : 146,
          lineHeight: mobile ? 1.04 : undefined,
          letterSpacing: -8,
        }}
      >
        Fix what{mobile ? <br /> : " "}matters.
      </Line>
      <Line
        delay={30}
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          top: mobile ? 654 : 500,
          fontSize: mobile ? 44 : 38,
          width: mobile ? 860 : undefined,
          lineHeight: mobile ? 1.45 : undefined,
          fontWeight: 400,
          color: B.muted,
        }}
      >
        From the first diagnosis to the real-world result.
      </Line>
      <div
        style={{
          position: "absolute",
          left: mobile ? 64 : 120,
          right: mobile ? 64 : 120,
          top: mobile ? 841 : 672,
          display: "flex",
          flexDirection: mobile ? "column" : "row",
        }}
      >
        {["Inspect", "Diagnose", "Build", "Deploy", "Measure"].map(
          (step, i) => {
            const lit = progress >= i / 4;
            return (
              <div
                key={step}
                style={{
                  position: "relative",
                  width: mobile ? "100%" : "20%",
                  paddingLeft: mobile || i === 0 ? 0 : 35,
                  borderLeft:
                    mobile || i === 0 ? "none" : `1px solid ${B.line}`,
                  height: mobile ? 83 : 196,
                  opacity: interpolate(
                    f,
                    [18 + i * 6, 40 + i * 6],
                    [0, 1],
                    smooth,
                  ),
                }}
              >
                <div
                  style={{
                    fontSize: mobile ? 30 : 22,
                    position: mobile ? "absolute" : undefined,
                    left: mobile ? 0 : undefined,
                    top: mobile ? 25 : undefined,
                    ...mono,
                    color: lit ? B.green : B.quiet,
                  }}
                >
                  0{i + 1} {lit ? " / ✓" : ""}
                </div>
                <div
                  style={{
                    fontSize: mobile ? 50 : 42,
                    fontWeight: 600,
                    marginTop: mobile ? 0 : 27,
                    position: mobile ? "absolute" : undefined,
                    left: mobile ? 190 : undefined,
                    top: mobile ? 12 : undefined,
                    color: lit ? B.ink : B.quiet,
                    letterSpacing: -1,
                  }}
                >
                  {step}
                </div>
                <div
                  style={{
                    height: 2,
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    right: 0,
                    background: B.line,
                  }}
                />
                <div
                  style={{
                    height: 2,
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: `${Math.max(0, Math.min(1, progress * 5 - i)) * 100}%`,
                    background: B.green,
                  }}
                />
              </div>
            );
          },
        )}
      </div>
    </Shell>
  );
};
