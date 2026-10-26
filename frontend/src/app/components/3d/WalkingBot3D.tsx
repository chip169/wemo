import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";



// ─── Multi-Theme Color Palettes ──────────────────────────────────────────────
export type SuitTheme = "pink" | "black" | "blue";
export type PropType = "gift" | "rose" | "ring";

interface ThemeColors {
  name: string;
  suitPrimary: string;
  suitLapel: string;
  suitDark: string;
  bowTie: string;
  robotSilver: string;
  robotJoints: string;
  visorScreen: string;
  neonGlow: string;
  earHub: string;
  boots: string;
  sparkleColor: string;
}

const THEMES: Record<SuitTheme, ThemeColors> = {
  pink: {
    name: "Hồng Sweetheart",
    suitPrimary: "#F472B6",
    suitLapel: "#FCE7F3",
    suitDark: "#DB2777",
    bowTie: "#E11D48",
    robotSilver: "#FDF2F8",
    robotJoints: "#9D174D",
    visorScreen: "#190812",
    neonGlow: "#FF2E93",
    earHub: "#E11D48",
    boots: "#9D174D",
    sparkleColor: "#F472B6",
  },
  black: {
    name: "Tuxedo Quý Phái",
    suitPrimary: "#141416",
    suitLapel: "#27272A",
    suitDark: "#09090B",
    bowTie: "#DC2626",
    robotSilver: "#E2E8F0",
    robotJoints: "#475569",
    visorScreen: "#0B0F19",
    neonGlow: "#00F0FF",
    earHub: "#2563EB",
    boots: "#1E3A8A",
    sparkleColor: "#38BDF8",
  },
  blue: {
    name: "Xanh Hoàng Gia",
    suitPrimary: "#2563EB",
    suitLapel: "#DBEAFE",
    suitDark: "#1D4ED8",
    bowTie: "#F59E0B",
    robotSilver: "#F1F5F9",
    robotJoints: "#1E3A8A",
    visorScreen: "#0F172A",
    neonGlow: "#38BDF8",
    earHub: "#F59E0B",
    boots: "#1E293B",
    sparkleColor: "#F59E0B",
  },
};

// ─── Authentic LEGO Stud with Hollow Center Rim ──────────────────────────────
function LegoStud({
  position,
  scale = [1, 1, 1],
  color = "#F472B6",
}: {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 28]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>
      {/* Inner recessed circle rim */}
      <mesh position={[0, 0.091, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.18, 24]} />
        <meshBasicMaterial color="#444444" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── Authentic LEGO Minifigure C-Claw Hand ──────────────────────────────────
function LegoHand({
  position,
  rotation = [0, 0, 0],
  color = "#FDF2F8",
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wrist cylinder collar */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.13, 0.14, 0.2, 20]} />
        <meshPhysicalMaterial color={color} roughness={0.18} metalness={0.2} clearcoat={0.9} />
      </mesh>
      {/* Thick Authentic LEGO C-Claw */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.08, 16, 28, Math.PI * 1.48]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          metalness={0.2}
          clearcoat={0.95}
        />
      </mesh>
    </group>
  );
}

// ─── Top Hat with Tilting capability ─────────────────────────────────────────
function LegoTopHat({
  theme,
  hatTiltRef,
}: {
  theme: ThemeColors;
  hatTiltRef?: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={hatTiltRef} position={[0, 0.88, 0]}>
      {/* Wide Hat Brim Plate */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.92, 0.94, 0.1, 32]} />
        <meshPhysicalMaterial
          color={theme.suitPrimary}
          roughness={0.14}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Ring of Studs along the Brim Rim */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r = 0.76;
        return (
          <LegoStud
            key={`brim-${i}`}
            position={[Math.cos(rad) * r, 0.09, Math.sin(rad) * r]}
            scale={[0.42, 0.4, 0.42]}
            color={theme.suitPrimary}
          />
        );
      })}

      {/* Hat Ribbon Band */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.67, 0.65, 0.14, 32]} />
        <meshPhysicalMaterial
          color={theme.suitDark}
          roughness={0.18}
          clearcoat={0.8}
        />
      </mesh>

      {/* Tall Cylinder Crown */}
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.66, 0.62, 1.04, 32]} />
        <meshPhysicalMaterial
          color={theme.suitPrimary}
          roughness={0.14}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Top Cap of the Crown */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.67, 0.66, 0.06, 32]} />
        <meshPhysicalMaterial
          color={theme.suitPrimary}
          roughness={0.14}
          clearcoat={1.0}
        />
      </mesh>

      {/* Top Studs on the Hat Crown */}
      <LegoStud position={[0, 1.16, 0]} scale={[0.82, 0.75, 0.82]} color={theme.suitPrimary} />
      {[-0.32, 0.32].map((x, i) =>
        [-0.32, 0.32].map((z, j) => (
          <LegoStud
            key={`top-${i}-${j}`}
            position={[x, 1.16, z]}
            scale={[0.55, 0.5, 0.55]}
            color={theme.suitPrimary}
          />
        ))
      )}
    </group>
  );
}

// ─── Robot Butler Head with Expressions ──────────────────────────────────────
function LegoRobotHead({
  theme,
  eyeState,
  hatTiltRef,
}: {
  theme: ThemeColors;
  eyeState: "normal" | "blink" | "happy" | "wink";
  hatTiltRef: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group position={[0, 0.92, 0]}>
      {/* Pearlescent Blush Main Head Cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.74, 0.74, 0.94, 32]} />
        <meshPhysicalMaterial
          color={theme.robotSilver}
          metalness={0.2}
          roughness={0.2}
          clearcoat={0.95}
        />
      </mesh>

      {/* Head Top Smooth Dome Joint */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <sphereGeometry args={[0.735, 32, 16]} />
        <meshPhysicalMaterial
          color={theme.robotSilver}
          metalness={0.2}
          roughness={0.2}
          clearcoat={0.95}
        />
      </mesh>

      {/* Top Hat */}
      <LegoTopHat theme={theme} hatTiltRef={hatTiltRef} />

      {/* Front Visor Screen Panel */}
      <mesh position={[0, 0.05, 0.68]} castShadow>
        <boxGeometry args={[0.96, 0.48, 0.14]} />
        <meshPhysicalMaterial
          color={theme.visorScreen}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* ── Glowing LED Visor Eyes ── */}
      {eyeState === "happy" ? (
        // Happy smiling glowing arches (^ ^)
        <>
          <group position={[-0.26, 0.08, 0.76]} rotation={[0, 0, Math.PI]}>
            <mesh>
              <torusGeometry args={[0.085, 0.025, 12, 24, Math.PI]} />
              <meshStandardMaterial
                color={theme.neonGlow}
                emissive={theme.neonGlow}
                emissiveIntensity={4.0}
                roughness={0.1}
              />
            </mesh>
          </group>
          <group position={[0.26, 0.08, 0.76]} rotation={[0, 0, Math.PI]}>
            <mesh>
              <torusGeometry args={[0.085, 0.025, 12, 24, Math.PI]} />
              <meshStandardMaterial
                color={theme.neonGlow}
                emissive={theme.neonGlow}
                emissiveIntensity={4.0}
                roughness={0.1}
              />
            </mesh>
          </group>
        </>
      ) : eyeState === "wink" ? (
        // Playful Wink (; ^)
        <>
          <mesh position={[-0.26, 0.06, 0.76]}>
            <boxGeometry args={[0.24, 0.035, 0.02]} />
            <meshStandardMaterial
              color={theme.neonGlow}
              emissive={theme.neonGlow}
              emissiveIntensity={3.8}
            />
          </mesh>
          <group position={[0.26, 0.08, 0.76]} rotation={[0, 0, Math.PI]}>
            <mesh>
              <torusGeometry args={[0.085, 0.025, 12, 24, Math.PI]} />
              <meshStandardMaterial
                color={theme.neonGlow}
                emissive={theme.neonGlow}
                emissiveIntensity={4.0}
                roughness={0.1}
              />
            </mesh>
          </group>
        </>
      ) : eyeState === "blink" ? (
        // Sleek horizontal glowing slits (- -)
        <>
          <mesh position={[-0.26, 0.06, 0.76]}>
            <boxGeometry args={[0.24, 0.035, 0.02]} />
            <meshStandardMaterial
              color={theme.neonGlow}
              emissive={theme.neonGlow}
              emissiveIntensity={3.8}
            />
          </mesh>
          <mesh position={[0.26, 0.06, 0.76]}>
            <boxGeometry args={[0.24, 0.035, 0.02]} />
            <meshStandardMaterial
              color={theme.neonGlow}
              emissive={theme.neonGlow}
              emissiveIntensity={3.8}
            />
          </mesh>
        </>
      ) : (
        // Iconic bright glowing rounded eyes
        <>
          <group position={[-0.26, 0.06, 0.76]}>
            <mesh>
              <boxGeometry args={[0.24, 0.22, 0.02]} />
              <meshStandardMaterial
                color={theme.neonGlow}
                emissive={theme.neonGlow}
                emissiveIntensity={3.8}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <ringGeometry args={[0.03, 0.07, 16]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} />
            </mesh>
          </group>

          <group position={[0.26, 0.06, 0.76]}>
            <mesh>
              <boxGeometry args={[0.24, 0.22, 0.02]} />
              <meshStandardMaterial
                color={theme.neonGlow}
                emissive={theme.neonGlow}
                emissiveIntensity={3.8}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <ringGeometry args={[0.03, 0.07, 16]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} />
            </mesh>
          </group>
        </>
      )}

      {/* Friendly Glowing Robot Smile Slit */}
      <mesh position={[0, -0.12, 0.76]}>
        <boxGeometry args={[0.34, 0.04, 0.02]} />
        <meshStandardMaterial
          color={theme.neonGlow}
          emissive={theme.neonGlow}
          emissiveIntensity={3.2}
        />
      </mesh>

      {/* Left Robotic Ear Audio Hub */}
      <group position={[-0.76, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          <meshPhysicalMaterial color={theme.robotSilver} metalness={0.3} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
          <meshPhysicalMaterial color={theme.earHub} clearcoat={1.0} />
        </mesh>
      </group>

      {/* Right Robotic Ear Audio Hub */}
      <group position={[0.76, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          <meshPhysicalMaterial color={theme.robotSilver} metalness={0.3} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
          <meshPhysicalMaterial color={theme.earHub} clearcoat={1.0} />
        </mesh>
      </group>

      {/* Neck Peg */}
      <mesh position={[0, -0.56, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.2, 24]} />
        <meshPhysicalMaterial color={theme.robotJoints} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Authentic LEGO Tuxedo Butler Torso ──────────────────────────────────────
function LegoButlerTorso({ theme }: { theme: ThemeColors }) {
  const torsoGeom = useMemo(() => {
    const shape = new THREE.Shape();
    const topW = 0.92;
    const botW = 1.22;
    const h = 1.48;

    shape.moveTo(-botW / 2, -h / 2);
    shape.lineTo(botW / 2, -h / 2);
    shape.lineTo(topW / 2, h / 2);
    shape.lineTo(-topW / 2, h / 2);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    g.center();
    return g;
  }, []);

  return (
    <group position={[0, 0.05, 0]}>
      {/* Tuxedo Jacket Shell */}
      <mesh geometry={torsoGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={theme.suitPrimary}
          roughness={0.14}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Crisp White Collared Shirt Insert */}
      <mesh position={[0, 0.12, 0.44]}>
        <planeGeometry args={[0.44, 0.88]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.2}
          clearcoat={0.6}
        />
      </mesh>

      {/* Left Lapel */}
      <mesh position={[-0.32, 0.06, 0.45]} rotation={[0, 0, -0.16]}>
        <boxGeometry args={[0.22, 1.05, 0.02]} />
        <meshPhysicalMaterial color={theme.suitLapel} roughness={0.12} clearcoat={1.0} />
      </mesh>

      {/* Right Lapel */}
      <mesh position={[0.32, 0.06, 0.45]} rotation={[0, 0, 0.16]}>
        <boxGeometry args={[0.22, 1.05, 0.02]} />
        <meshPhysicalMaterial color={theme.suitLapel} roughness={0.12} clearcoat={1.0} />
      </mesh>

      {/* Bow Tie */}
      <group position={[0, 0.46, 0.48]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.12, 0.08]} />
          <meshPhysicalMaterial color={theme.bowTie} roughness={0.18} clearcoat={0.9} />
        </mesh>
        <mesh position={[-0.14, 0, 0]} rotation={[0, 0, -0.18]} castShadow>
          <coneGeometry args={[0.13, 0.22, 4]} />
          <meshPhysicalMaterial color={theme.bowTie} roughness={0.18} clearcoat={0.9} />
        </mesh>
        <mesh position={[0.14, 0, 0]} rotation={[0, 0, 0.18]} castShadow>
          <coneGeometry args={[0.13, 0.22, 4]} />
          <meshPhysicalMaterial color={theme.bowTie} roughness={0.18} clearcoat={0.9} />
        </mesh>
      </group>

      {/* Buttons */}
      <mesh position={[0, 0.18, 0.455]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color={theme.suitDark} />
      </mesh>
      <mesh position={[0, 0.02, 0.455]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color={theme.suitDark} />
      </mesh>
      <mesh position={[0, -0.14, 0.455]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color={theme.suitDark} />
      </mesh>

      {/* Folded Pocket Square */}
      <group position={[0.34, 0.26, 0.455]} rotation={[0, 0, -0.15]}>
        <mesh>
          <planeGeometry args={[0.16, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.035, 0]}>
          <coneGeometry args={[0.04, 0.06, 3]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Gold Chain */}
      <mesh position={[-0.18, -0.22, 0.455]} rotation={[0, 0, 0.35]}>
        <torusGeometry args={[0.1, 0.014, 8, 16, Math.PI * 0.9]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── Interactive Props Rendered on LEGO Tray (Gift / Rose / Ring) ────────────
function LegoTrayProp({ propType, theme }: { propType: PropType; theme: ThemeColors }) {
  const propRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (propRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle levitating juggle hover
      propRef.current.position.y = 0.14 + Math.sin(t * 3.5) * 0.05;
      propRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={propRef} position={[0, 0.14, 0]}>
      {propType === "gift" ? (
        // Glowing LEGO Gift Brick
        <group scale={[0.62, 0.62, 0.62]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.24, 0.26]} />
            <meshStandardMaterial
              color={theme.neonGlow}
              emissive={theme.neonGlow}
              emissiveIntensity={2.8}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial
              color={theme.neonGlow}
              emissive={theme.neonGlow}
              emissiveIntensity={2.8}
            />
          </mesh>
        </group>
      ) : propType === "rose" ? (
        // Miniature LEGO Red Rose Bouquet
        <group scale={[0.55, 0.55, 0.55]}>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.25, 12]} />
            <meshPhysicalMaterial color="#15803D" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshPhysicalMaterial color="#DC2626" roughness={0.18} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[0, Math.PI / 4, 0]}>
            <torusGeometry args={[0.1, 0.04, 8, 16]} />
            <meshPhysicalMaterial color="#E11D48" roughness={0.18} />
          </mesh>
        </group>
      ) : (
        // Sparkling Golden Ring Box with Crystal Gem
        <group scale={[0.55, 0.55, 0.55]}>
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.14, 0.15, 0.14, 20]} />
            <meshPhysicalMaterial color="#831843" roughness={0.2} clearcoat={0.9} />
          </mesh>
          {/* Gold Ring Band */}
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.08, 0.02, 12, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Sparkling Gem */}
          <mesh position={[0, 0.15, 0]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#38BDF8"
              emissiveIntensity={3.2}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ─── Main 3D Model with Tip-the-Hat, Juggling & Autonomous Behaviors ─────────
function LegoRobotButlerModel({
  isHovered,
  isTippingHat,
  theme,
  propType,
  dragRotationY,
}: {
  isHovered: boolean;
  isTippingHat: boolean;
  theme: ThemeColors;
  propType: PropType;
  dragRotationY: number;
}) {
  const figureGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const hatTiltRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const { pointer } = useThree();

  // Eye-State Machine
  const [eyeState, setEyeState] = useState<"normal" | "blink" | "happy" | "wink">("normal");

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // ── 1. Autonomous Eye Expression Logic ───────────────────────────────────
    if (isTippingHat) {
      if (eyeState !== "happy") setEyeState("happy");
    } else if (isHovered) {
      // Alternate between happy smile and cheeky wink every 2.5s on hover
      const hoverCycle = (t % 5.0);
      if (hoverCycle < 2.5) {
        if (eyeState !== "happy") setEyeState("happy");
      } else {
        if (eyeState !== "wink") setEyeState("wink");
      }
    } else {
      const blinkCycle = (t % 3.6);
      if (blinkCycle < 0.16) {
        if (eyeState !== "blink") setEyeState("blink");
      } else {
        if (eyeState !== "normal") setEyeState("normal");
      }
    }

    // ── 2. Head Mouse-Tracking & Inquisitive Tilts ────────────────────────────
    if (headRef.current) {
      const targetRotY = pointer.x * 0.45;
      const targetRotX = -pointer.y * 0.28 + Math.sin(t * 1.4) * 0.03;
      const targetTiltZ = isHovered ? -0.1 : Math.sin(t * 0.9) * 0.05;

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetTiltZ, 0.08);
    }

    // ── 3. Tip-The-Hat Mechanics ─────────────────────────────────────────────
    if (hatTiltRef.current) {
      if (isTippingHat) {
        // Polite forward tilt of the top hat
        hatTiltRef.current.rotation.x = THREE.MathUtils.lerp(hatTiltRef.current.rotation.x, 0.24, 0.15);
      } else {
        hatTiltRef.current.rotation.x = THREE.MathUtils.lerp(hatTiltRef.current.rotation.x, 0, 0.1);
      }
    }

    // ── 4. Autonomous Butler Animation Modes ──────────────────────────────────
    const animPhase = t % 15;
    let mode: "idle" | "wave" | "walk" | "tip" = "idle";

    if (isTippingHat) {
      mode = "tip";
    } else if (isHovered) {
      mode = "wave";
    } else if (animPhase > 4 && animPhase < 8.5) {
      mode = "wave";
    } else if (animPhase >= 11 && animPhase <= 14) {
      mode = "walk";
    }

    // ── 5. Body Float & User 360 Drag Spin ───────────────────────────────────
    if (figureGroupRef.current) {
      if (mode === "tip") {
        figureGroupRef.current.position.y = -0.2;
        figureGroupRef.current.rotation.x = 0.16; // Polite respectful bow
      } else if (mode === "walk") {
        figureGroupRef.current.position.y = -0.16 + Math.abs(Math.sin(t * 5)) * 0.04;
        figureGroupRef.current.rotation.x = THREE.MathUtils.lerp(figureGroupRef.current.rotation.x, 0, 0.1);
      } else {
        // Natural gentle idle breathing float
        figureGroupRef.current.position.y = -0.16 + Math.sin(t * 2.2) * 0.03;
        figureGroupRef.current.rotation.x = THREE.MathUtils.lerp(figureGroupRef.current.rotation.x, 0, 0.08);
      }

      // Smoothly blend user 360-degree drag spin with idle sway
      const targetBodyY = dragRotationY + (mode === "walk" ? Math.sin(t * 2.5) * 0.06 : 0);
      figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        figureGroupRef.current.rotation.y,
        targetBodyY,
        0.12
      );
    }

    // ── 6. Right Arm (Tip-The-Hat vs Waving Gesture) ──────────────────────────
    if (rightArmRef.current) {
      if (mode === "tip") {
        // Right hand reaches up to touch and tip the hat brim
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.92, 0.15);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.85, 0.15);
      } else if (mode === "walk") {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.1);
        rightArmRef.current.rotation.x = Math.sin(t * 5) * 0.38;
      } else if (mode === "wave") {
        const waveSpeed = isHovered ? 7.2 : 3.8;
        const waveAmp = isHovered ? 0.38 : 0.25;
        const wave = Math.sin(t * waveSpeed) * waveAmp;
        rightArmRef.current.rotation.z = -0.42 + wave;
        rightArmRef.current.rotation.x = 0.15 + Math.cos(t * 2.5) * 0.08;
      } else {
        // Polite rest
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.16, 0.08);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.08, 0.08);
      }
    }

    // ── 7. Left Arm (Outstretched Welcoming Butler Gesture) ───────────────────
    if (leftArmRef.current) {
      if (mode === "tip") {
        leftArmRef.current.rotation.x = 0.25;
        leftArmRef.current.rotation.z = -0.14;
      } else if (mode === "walk") {
        leftArmRef.current.rotation.x = 0.12 - Math.sin(t * 5) * 0.2;
      } else {
        // Welcoming outstretched butler gesture (gentle breathing float)
        leftArmRef.current.rotation.x = 0.06 + Math.sin(t * 1.5) * 0.03;
        leftArmRef.current.rotation.z = -0.08 + Math.cos(t * 1.5) * 0.02;
      }
    }

    // ── 8. Legs (Autonomous stepping) ───────────────────────────────────────
    if (leftLegRef.current && rightLegRef.current) {
      if (mode === "walk") {
        leftLegRef.current.rotation.x = Math.sin(t * 5) * 0.36;
        rightLegRef.current.rotation.x = -Math.sin(t * 5) * 0.36;
      } else {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  return (
    <group ref={figureGroupRef} position={[0, -0.16, 0]}>
      {/* ── 1. Robot Butler Head & Top Hat ── */}
      <group ref={headRef}>
        <LegoRobotHead theme={theme} eyeState={eyeState} hatTiltRef={hatTiltRef} />
      </group>

      {/* ── 2. Tuxedo Butler Torso ── */}
      <group>
        <LegoButlerTorso theme={theme} />

        {/* ── Left Arm (Authentic Outstretched LEGO Robot Butler Arm) ── */}
        <group ref={leftArmRef} position={[-0.64, 0.52, 0]}>
          {/* Shoulder Sleeve */}
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.28, 0.26]} />
            <meshPhysicalMaterial color={theme.suitPrimary} roughness={0.16} clearcoat={1.0} />
          </mesh>
          {/* Shoulder Hinge Pin */}
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.1, 18]} />
            <meshPhysicalMaterial color={theme.robotJoints} roughness={0.3} />
          </mesh>

          {/* Upper Arm Block */}
          <group position={[-0.16, -0.2, 0.12]} rotation={[-0.32, -0.2, 0.4]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.38, 0.24]} />
              <meshPhysicalMaterial color="#FFFFFF" roughness={0.16} clearcoat={0.9} />
            </mesh>
            {/* Authentic pin hole on side */}
            <mesh position={[-0.115, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.065, 16]} />
              <meshBasicMaterial color={theme.robotJoints} />
            </mesh>
          </group>

          {/* Elbow Hinge Joint */}
          <group position={[-0.32, -0.36, 0.26]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.22, 24]} />
              <meshPhysicalMaterial color={theme.robotJoints} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.065, 16]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </group>

          {/* Forearm Segment with 2 LEGO Studs */}
          <group position={[-0.48, -0.34, 0.5]} rotation={[-0.12, 0.52, -0.18]}>
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.22, 0.46]} />
              <meshPhysicalMaterial color="#FFFFFF" roughness={0.16} clearcoat={0.9} />
            </mesh>
            <LegoStud position={[0, 0.15, -0.11]} scale={[0.42, 0.38, 0.42]} color={theme.suitPrimary} />
            <LegoStud position={[0, 0.15, 0.11]} scale={[0.42, 0.38, 0.42]} color={theme.suitPrimary} />

            {/* Wrist Collar */}
            <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.08, 20]} />
              <meshPhysicalMaterial color={theme.suitDark} roughness={0.2} />
            </mesh>

            {/* C-Claw Hand */}
            <LegoHand position={[0, 0, 0.36]} rotation={[0.4, 0, Math.PI / 2]} color={theme.robotSilver} />

            {/* Authentic LEGO 2x2 Display Plate Tray with 4 Studs */}
            <group position={[0, 0.15, 0.44]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.48, 0.08, 0.42]} />
                <meshPhysicalMaterial color={theme.robotSilver} metalness={0.25} roughness={0.2} clearcoat={0.8} />
              </mesh>
              {[-0.12, 0.12].map((x, i) =>
                [-0.09, 0.09].map((z, j) => (
                  <LegoStud
                    key={`tray-${i}-${j}`}
                    position={[x, 0.06, z]}
                    scale={[0.36, 0.32, 0.36]}
                    color={theme.suitPrimary}
                  />
                ))
              )}

              {/* Juggling / Hovering Prop on the Tray */}
              <LegoTrayProp propType={propType} theme={theme} />
            </group>
          </group>
        </group>

        {/* ── Right Arm (Authentic Waving LEGO Arm) ── */}
        <group ref={rightArmRef} position={[0.64, 0.52, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.28, 0.26]} />
            <meshPhysicalMaterial color={theme.suitPrimary} roughness={0.16} clearcoat={1.0} />
          </mesh>
          <group position={[0.16, 0.18, 0.06]} rotation={[-0.2, 0, -0.45]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.42, 0.24]} />
              <meshPhysicalMaterial color="#FFFFFF" roughness={0.16} clearcoat={0.9} />
            </mesh>
            <mesh position={[0.115, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.065, 16]} />
              <meshBasicMaterial color={theme.robotJoints} />
            </mesh>
            <LegoStud position={[0, 0.24, 0]} scale={[0.38, 0.35, 0.38]} color={theme.suitPrimary} />
            <LegoHand position={[0, 0.32, 0]} rotation={[0.4, 0.25, -0.65]} color={theme.robotSilver} />
          </group>
        </group>
      </group>

      {/* ── 3. Tuxedo Hips & Robotic Butler Legs ── */}
      <group position={[0, -0.7, 0]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[1.22, 0.2, 0.78]} />
          <meshPhysicalMaterial color={theme.suitPrimary} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 1.26, 24]} />
          <meshPhysicalMaterial color={theme.robotJoints} roughness={0.3} />
        </mesh>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.36, -0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.98, 0.74]} />
            <meshPhysicalMaterial color="#FFFFFF" roughness={0.16} clearcoat={0.9} />
          </mesh>
          <mesh position={[0, -0.4, 0.2]}>
            <boxGeometry args={[0.52, 0.18, 0.36]} />
            <meshPhysicalMaterial color={theme.boots} roughness={0.2} />
          </mesh>
          <mesh position={[-0.27, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 18]} />
            <meshBasicMaterial color={theme.robotJoints} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.36, -0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.98, 0.74]} />
            <meshPhysicalMaterial color="#FFFFFF" roughness={0.16} clearcoat={0.9} />
          </mesh>
          <mesh position={[0, -0.4, 0.2]}>
            <boxGeometry args={[0.52, 0.18, 0.36]} />
            <meshPhysicalMaterial color={theme.boots} roughness={0.2} />
          </mesh>
          <mesh position={[0.27, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 18]} />
            <meshBasicMaterial color={theme.robotJoints} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Main Exported Floating LEGO AI Butler Mascot Component ──────────────────
export interface WalkingBot3DProps {
  onOpenChat?: () => void;
  className?: string;
}

export function WalkingBot3D({ onOpenChat, className = "" }: WalkingBot3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTippingHat, setIsTippingHat] = useState(false);
  const suitTheme: SuitTheme = "pink";
  const propType: PropType = "gift";

  // Interactive 360-degree rotation drag
  const [dragRotationY, setDragRotationY] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startRotYRef = useRef(0);

  const theme = THEMES[suitTheme];

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotYRef.current = dragRotationY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    setDragRotationY(startRotYRef.current + dx * 0.025);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Reset 360 drag rotation slowly when mouse leaves
  useEffect(() => {
    if (!isHovered && dragRotationY !== 0) {
      const timer = setTimeout(() => {
        setDragRotationY(0);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isHovered, dragRotationY]);

  // Click handler: Plays tip-hat chime, performs tip-hat bow, then opens chat
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if not actively dragging
    if (Math.abs(dragRotationY - startRotYRef.current) > 0.1) return;

    setIsTippingHat(true);
    setTimeout(() => {
      setIsTippingHat(false);
      if (onOpenChat) onOpenChat();
    }, 700);
  };

  return (
    <div
      className={`fixed bottom-3 right-3 z-50 select-none flex flex-col items-end ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        isDraggingRef.current = false;
      }}
    >


      {/* ── 3D LEGO Mascot Canvas (Drag to rotate 360°, Click to Tip Hat & Open Chat) ── */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        title="Nhấn để Quản Gia nhấc mũ chào & trò chuyện 🎩✨ (Kéo chuột xoay 360°)"
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className="relative"
          style={{
            width: 132,
            height: 154,
            background: "transparent",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [-0.12, 0.38, 6.4], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.96} />
            {/* Key Studio Light */}
            <directionalLight position={[4, 8, 5]} intensity={2.2} castShadow />
            {/* Soft Warm Studio Fill Light */}
            <directionalLight position={[-4, 3, 3]} intensity={1.2} color="#FCE7F3" />
            {/* Rim Backlight highlighting the Top Hat & Shoulders */}
            <directionalLight position={[0, 5, -5]} intensity={1.8} color="#FDA4AF" />
            {/* Soft Neon Visor Glow */}
            <pointLight position={[0, 0.95, 1.1]} intensity={1.6} color={theme.neonGlow} distance={2.5} />

            {/* Ambient Sparkles */}
            <Sparkles count={18} scale={3.2} size={2.0} speed={0.45} color={theme.sparkleColor} opacity={0.7} />

            <Float speed={1.8} rotationIntensity={0.04} floatIntensity={0.08}>
              <group scale={[0.72, 0.72, 0.72]}>
                <LegoRobotButlerModel
                  isHovered={isHovered}
                  isTippingHat={isTippingHat}
                  theme={theme}
                  propType={propType}
                  dragRotationY={dragRotationY}
                />
              </group>
            </Float>

            {/* Ground Contact Shadow */}
            <ContactShadows position={[0, -1.75, 0]} opacity={0.3} scale={2.4} blur={1.5} far={2.2} />
          </Canvas>

          {/* Online green indicator dot */}
          <span className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

export default WalkingBot3D;
