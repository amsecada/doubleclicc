import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
loadFont({
  family: "Inter",
  url: new URL(`${import.meta.env.BASE_URL}fonts/Inter-400.ttf`, document.baseURI).href,
  weight: "400",
});
loadFont({
  family: "Inter",
  url: new URL(`${import.meta.env.BASE_URL}fonts/Inter-600.ttf`, document.baseURI).href,
  weight: "600",
});
loadFont({
  family: "IBM Plex Mono",
  url: new URL(`${import.meta.env.BASE_URL}fonts/IBM-Plex-Mono-400.ttf`, document.baseURI).href,
  weight: "400",
});
export const B = {
  bg: "#0b0c0c",
  panel: "#101313",
  ink: "#e9e5dd",
  muted: "#b8b3aa",
  quiet: "#8a857c",
  line: "rgba(233,229,221,.14)",
  green: "#8cf5b3",
  amber: "#ffb454",
  red: "#ff6b5e",
};
// The Player chooses the canvas dimensions; the same scenes serve both layouts.
export const useBrandLayout = () => {
  const { width, height } = useVideoConfig();
  return { mobile: height > width, width, height };
};
export const smooth = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;
export const mono: React.CSSProperties = {
  fontFamily: "IBM Plex Mono",
  fontWeight: 400,
  letterSpacing: 2,
};
export const Slashes = ({
  size = 72,
  color = B.green,
  outline = false,
  style,
}: {
  size?: number;
  color?: string;
  outline?: boolean;
  style?: React.CSSProperties;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ overflow: "visible", ...style }}
  >
    <path
      d="M35 8 L48 8 L19 92 L6 92 Z M80 8 L93 8 L64 92 L51 92 Z"
      fill={outline ? "none" : color}
      stroke={outline ? color : "none"}
      strokeWidth={outline ? 1 : 0}
    />
  </svg>
);
export const Wordmark = ({ size = 28 }: { size?: number }) => (
  <div
    style={{
      display: "flex",
      gap: size * 0.48,
      alignItems: "center",
      fontSize: size,
      fontWeight: 600,
      letterSpacing: size * 0.13,
    }}
  >
    <Slashes size={size * 1.25} />
    <span>DOUBLECLICC</span>
  </div>
);
export const Dot = ({
  color = B.green,
  size = 8,
}: {
  color?: string;
  size?: number;
}) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 ${size * 2}px ${color}70`,
    }}
  />
);
export const Shell: React.FC<{
  children: React.ReactNode;
  chapter: string;
  status?: string;
  warm?: boolean;
}> = ({ children, chapter, status = "SYSTEM ONLINE", warm = false }) => {
  const f = useCurrentFrame();
  const { mobile, width } = useBrandLayout();
  const margin = mobile ? 64 : 116;
  const trackWidth = width - margin * 2;
  return (
    <AbsoluteFill
      style={{
        background: B.bg,
        color: B.ink,
        fontFamily: "Inter",
        fontWeight: 600,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${warm ? "76% 45%" : "78% 65%"}, ${warm ? "rgba(255,180,84,.075)" : "rgba(140,245,179,.065)"}, transparent 65%)`,
        }}
      />
      <div style={{ position: "absolute", left: margin, top: 70 }}>
        <Wordmark size={mobile ? 38 : 28} />
      </div>
      <div
        style={{
          position: "absolute",
          right: margin,
          top: 82,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: mobile ? 22 : 17,
          color: B.quiet,
          ...mono,
        }}
      >
        <Dot color={warm ? B.amber : B.green} />
        {status}
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          top: mobile ? 158 : 143,
          height: 1,
          background: B.line,
        }}
      />
      {children}
      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          bottom: 66,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: mobile ? 24 : 17,
          color: B.quiet,
          ...mono,
        }}
      >
        <span>
          {mobile ? "REVENUE SYSTEMS" : "DBLCLICC // REVENUE SYSTEMS"}
        </span>
        <span>{chapter}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          bottom: 110,
          width: trackWidth,
          height: 1,
          background: B.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: margin,
          bottom: 110,
          width: Math.min(trackWidth, f * (mobile ? trackWidth / 162 : 10.5)),
          height: 1,
          background: warm ? `${B.amber}70` : `${B.green}70`,
        }}
      />
    </AbsoluteFill>
  );
};
export const Label: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div style={{ ...mono, fontSize: 20, color: B.quiet, ...style }}>
    {children}
  </div>
);
export const Line: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ overflow: "hidden", paddingBottom: 12, ...style }}>
      <div
        style={{
          opacity: interpolate(f, [delay, delay + 20], [0, 1], smooth),
          translate: `0 ${interpolate(f, [delay, delay + 32], [65, 0], smooth)}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
export const BrandBridge = ({ progress }: { progress: number }) => {
  const { mobile } = useBrandLayout();
  return (
    <AbsoluteFill
      style={{
        background: B.bg,
        opacity: progress,
        justifyContent: "center",
        alignItems: "center",
        color: B.ink,
        fontFamily: "Inter",
        zIndex: 30,
      }}
    >
      <Wordmark size={mobile ? 68 : 52} />
    </AbsoluteFill>
  );
};
