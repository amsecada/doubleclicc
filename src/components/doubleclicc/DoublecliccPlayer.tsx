import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Player, type PlayerRef } from "@remotion/player";

const loadIntro = () =>
  import("./Intro").then(({ Intro }) => ({ default: Intro }));

export type DoublecliccPlayerProps = {
  diagnosticHref?: string;
  onDiagnostic?: () => void;
  playbackSuspended?: boolean;
  ctaLabel?: string;
  mobileBreakpoint?: number;
  className?: string;
  style?: CSSProperties;
};

const controlStyle: CSSProperties = {
  font: "inherit",
  fontSize: 14,
  lineHeight: 1.4,
  padding: "12px 18px",
  border: "1px solid #8cf5b370",
  borderRadius: 2,
  color: "#e9e5dd",
  background: "#101313",
  textDecoration: "none",
  cursor: "pointer",
};

const Fallback = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "8%",
      background:
        "radial-gradient(ellipse at bottom right, #14271b, #0b0c0c 75%)",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        fontSize: "clamp(32px, 6vw, 96px)",
        lineHeight: 1.08,
        fontWeight: 600,
      }}
    >
      Less busywork.
      <br />
      <span style={{ color: "#8cf5b3" }}>More revenue.</span>
    </div>
  </div>
);

/** Website embed. Supply the existing diagnostic URL OR a form-opening callback. */
export const DoublecliccPlayer = ({
  diagnosticHref,
  onDiagnostic,
  playbackSuspended = false,
  ctaLabel = "Run Revenue Diagnostic",
  mobileBreakpoint = 768,
  className,
  style,
}: DoublecliccPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerRef>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () =>
      setContainerWidth(container.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const mobile = containerWidth !== null && containerWidth < mobileBreakpoint;
  const animate =
    containerWidth !== null && containerWidth > 0 && !reducedMotion && !failed;

  useEffect(() => {
    const player = playerRef.current;
    if (!animate || !player) return;
    const onError = () => setFailed(true);
    player.addEventListener("error", onError);
    return () => {
      player.removeEventListener("error", onError);
    };
  }, [animate]);

  useEffect(() => {
    const player = playerRef.current;
    if (!animate || !player) return;
    if (playbackSuspended) player.pause();
    else player.play();
  }, [animate, playbackSuspended]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        minWidth: 0,
        background: "#0b0c0c",
        color: "#e9e5dd",
        fontFamily: "Inter, system-ui, sans-serif",
        ...style,
      }}
    >
      {/* Keep the site's semantic heading outside this decorative animation. */}
      <div
        className="doubleclicc-player__canvas"
        style={{ aspectRatio: mobile ? "3 / 4" : "16 / 9" }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            aspectRatio: mobile ? "3 / 4" : "16 / 9",
            overflow: "hidden",
          }}
        >
          {animate ? (
            <Player
              ref={playerRef}
              lazyComponent={loadIntro}
              compositionWidth={mobile ? 1080 : 1920}
              compositionHeight={mobile ? 1440 : 1080}
              fps={30}
              durationInFrames={750}
              autoPlay={!playbackSuspended}
              loop
              initiallyMuted
              controls={false}
              clickToPlay={false}
              doubleClickToFullscreen={false}
              spaceKeyToPlayOrPause={false}
              allowFullscreen={false}
              numberOfSharedAudioTags={0}
              renderLoading={() => <Fallback />}
              errorFallback={() => <Fallback />}
              style={{ width: "100%" }}
            />
          ) : (
            <Fallback />
          )}
        </div>
        {onDiagnostic ? (
          <button
            type="button"
            className="doubleclicc-player__banner-link"
            aria-label={`${ctaLabel} — animated banner`}
            onClick={onDiagnostic}
          />
        ) : diagnosticHref ? (
          <a
            className="doubleclicc-player__banner-link"
            aria-label={`${ctaLabel} — animated banner`}
            href={diagnosticHref}
            target="_blank"
            rel="noopener noreferrer"
          />
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 6% 24px",
        }}
      >
        {onDiagnostic ? (
          <button type="button" style={controlStyle} onClick={onDiagnostic}>
            {ctaLabel} <span aria-hidden="true">↗</span>
          </button>
        ) : diagnosticHref ? (
          <a href={diagnosticHref} target="_blank" rel="noopener noreferrer" style={controlStyle}>
            {ctaLabel} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </div>
  );
};
