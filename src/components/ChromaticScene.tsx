import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "motion/react";
import { AdditiveBlending, Color, NormalBlending, type Points } from "three";

type Theme = "dark" | "light";

/* Per-theme palette. On dark, bright ice points glow additively. On a light
   background additive blending is invisible (adding light to white = nothing),
   so light mode uses darker steel points drawn with normal blending. */
const PALETTE = {
  dark: { inside: "#e9f2f7", outside: "#6b8492", fog: "#08080b" },
  // Deeper, more saturated steel so points read as a deliberate spiral on white
  // instead of faint scattered dust. Rim kept dark enough to stay visible.
  light: { inside: "#1f4a5a", outside: "#4f7280", fog: "#eef1f4" },
} as const;

/* Hero centerpiece: a glowing particle galaxy you can DRAG to orbit.
   - Spiral-arm point distribution, ice core fading to steel at the rim.
   - Auto-rotates, and OrbitControls let you spin it by dragging (desktop).
   - Bloom postprocessing gives the dark, premium glow.
   - Reduced motion freezes the auto-spin; mobile drops particle count and
     disables pointer capture so the page still scrolls. */

function Galaxy({ lowPower, theme }: { lowPower: boolean; theme: Theme }) {
  const group = useRef<Points>(null);
  const reduce = useReducedMotion();

  const COUNT = lowPower ? 7000 : 20000;
  const BRANCHES = 4;
  const RADIUS = 5;
  const SPIN = 0.9;
  const RANDOMNESS = 0.45;
  const RAND_POWER = 2.6;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const inside = new Color(PALETTE[theme].inside); // core
    const outside = new Color(PALETTE[theme].outside); // rim
    const mixed = new Color();

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.random() * RADIUS;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = radius * SPIN;

      const scatter = (axis: number) =>
        Math.pow(Math.random(), RAND_POWER) *
        (Math.random() < 0.5 ? 1 : -1) *
        RANDOMNESS *
        radius *
        axis;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + scatter(1);
      positions[i3 + 1] = scatter(0.35);
      positions[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * radius + scatter(1);

      mixed.copy(inside).lerp(outside, Math.min(1, radius / RADIUS));
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }
    return { positions, colors };
  }, [COUNT, theme]);

  useFrame((_, delta) => {
    if (group.current && !reduce) {
      group.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <points ref={group} rotation={[0.55, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={
          theme === "light"
            ? lowPower
              ? 0.036
              : 0.028
            : lowPower
            ? 0.03
            : 0.022
        }
        sizeAttenuation
        vertexColors
        transparent
        opacity={theme === "light" ? 1 : 0.9}
        depthWrite={false}
        blending={theme === "light" ? NormalBlending : AdditiveBlending}
      />
    </points>
  );
}

export default function ChromaticScene({ theme = "dark" }: { theme?: Theme }) {
  const reduce = useReducedMotion();
  const lowPower = useMemo(
    () =>
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    []
  );

  return (
    <Canvas
      camera={{ position: [0, 2.4, 8], fov: 42 }}
      dpr={lowPower ? [1, 1.3] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", pointerEvents: lowPower ? "none" : "auto" }}
    >
      <fog attach="fog" args={[PALETTE[theme].fog, 9, 18]} />
      <Galaxy lowPower={lowPower} theme={theme} />

      {/* Drag to orbit on desktop; mobile just auto-rotates so scroll passes through. */}
      {!lowPower && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reduce}
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.62}
        />
      )}

      <EffectComposer>
        <Bloom
          intensity={theme === "light" ? 0.25 : lowPower ? 0.7 : 1.15}
          luminanceThreshold={theme === "light" ? 0.7 : 0.05}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
