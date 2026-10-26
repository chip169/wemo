import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

// ─── Authentic LEGO Colors (High-Gloss ABS Plastic) ─────────────────────────
const LEGO_COLORS = {
  skinYellow: "#FFC53D",       // Classic Minifigure Warm Yellow
  shirtWhite: "#FFFFFF",       // Crisp White Studio Tee
  pantsBrown: "#BD7A36",       // Warm Caramel Pants
  pantsDark: "#854A18",        // Dark caramel accents & hip bar
  heartPink: "#FF4D6D",        // Translucent candy heart
  eyeBlack: "#18100C",         // Glossy black pupil
  eyeIris: "#5A3010",          // Warm amber iris
  cheeks: "#FF7D6B",           // Soft rosy cheek blush
  goldAccent: "#D4AF78",       // Rose gold / gold emblem
  wemoCoral: "#E8B4A8",        // WEMO signature coral
};

// ─── Authentic LEGO Stud with Hollow Center Rim ──────────────────────────────
function LegoStud({ position, scale = [1, 1, 1], color = LEGO_COLORS.skinYellow }: {
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
          roughness={0.14}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>
      {/* Authentic inner recessed hole circle */}
      <mesh position={[0, 0.091, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.18, 24]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── Authentic LEGO Minifigure C-Claw Hand ──────────────────────────────────
function LegoHand({ position, rotation = [0, 0, 0], color = LEGO_COLORS.skinYellow }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wrist cylinder peg */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.22, 18]} />
        <meshPhysicalMaterial color={color} roughness={0.16} clearcoat={0.9} />
      </mesh>
      {/* Curved C-Claw (open torus arc) */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.075, 16, 28, Math.PI * 1.42]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </group>
  );
}

// ─── Authentic LEGO Trapezoid Torso ─────────────────────────────────────────
function LegoTorso() {
  const geom = useMemo(() => {
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
    <group>
      {/* White Studio Tee */}
      <mesh geometry={geom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={LEGO_COLORS.shirtWhite}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Front Heart & WEMO Print Decal */}
      <mesh position={[0, 0.08, 0.44]}>
        <circleGeometry args={[0.26, 24]} />
        <meshBasicMaterial color="#FFF0EC" />
      </mesh>
      <mesh position={[0, 0.08, 0.445]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color={LEGO_COLORS.wemoCoral} />
      </mesh>

      {/* WEMO Mini Text Badge */}
      <mesh position={[0, -0.22, 0.44]}>
        <planeGeometry args={[0.42, 0.12]} />
        <meshBasicMaterial color={LEGO_COLORS.goldAccent} />
      </mesh>
      <mesh position={[0, -0.22, 0.445]}>
        <planeGeometry args={[0.36, 0.08]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// ─── Translucent Candy Heart Brick ──────────────────────────────────────────
function GlowingHeartBrick({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.25);
    s.bezierCurveTo(0, 0.35, -0.25, 0.55, -0.45, 0.55);
    s.bezierCurveTo(-0.75, 0.55, -0.75, 0.2, -0.75, 0.2);
    s.bezierCurveTo(-0.75, -0.05, -0.5, -0.3, 0, -0.65);
    s.bezierCurveTo(0.5, -0.3, 0.75, -0.05, 0.75, 0.2);
    s.bezierCurveTo(0.75, 0.2, 0.75, 0.55, 0.45, 0.55);
    s.bezierCurveTo(0.25, 0.55, 0, 0.35, 0, 0.25);
    return s;
  }, []);

  const geom = useMemo(() => {
    return new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
  }, [heartShape]);

  return (
    <group position={position} scale={[0.44, 0.44, 0.44]}>
      <mesh geometry={geom} castShadow>
        <meshPhysicalMaterial
          color={LEGO_COLORS.heartPink}
          emissive={LEGO_COLORS.heartPink}
          emissiveIntensity={0.85}
          roughness={0.08}
          transmission={0.88}
          thickness={0.8}
          clearcoat={1.0}
        />
      </mesh>
      <LegoStud position={[-0.32, 0.58, 0.12]} color={LEGO_COLORS.heartPink} scale={[0.55, 0.55, 0.55]} />
      <LegoStud position={[0.32, 0.58, 0.12]} color={LEGO_COLORS.heartPink} scale={[0.55, 0.55, 0.55]} />
    </group>
  );
}

// ─── Complete Autonomous LEGO Minifigure Character ──────────────────────────
function LegoMinifigureBot({
  isHovered,
  isClicked,
}: {
  isHovered: boolean;
  isClicked: boolean;
}) {
  const figureGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const [eyeState, setEyeState] = useState<"normal" | "blink" | "happy">("normal");

  const { mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // ── 1. Autonomous Natural Behavior Cycle (16s timeline) ─────────────────
    // 0s-6s: Calm idle float & curious eye blinking
    // 6s-9.5s: Spontaneous friendly wave
    // 9.5s-12.5s: Cute head tilt
    // 12.5s-16s: Light bipedal step / walk
    const cycle = t % 16;
    let mode: "idle" | "wave" | "tilt" | "walk" | "dance" = "idle";

    if (isClicked) {
      mode = "dance";
    } else if (isHovered) {
      mode = "wave";
    } else if (cycle >= 6 && cycle < 9.5) {
      mode = "wave";
    } else if (cycle >= 9.5 && cycle < 12.5) {
      mode = "tilt";
    } else if (cycle >= 12.5) {
      mode = "walk";
    }

    // ── 2. Cute Natural Eye Blinking (Every ~3.8s for 0.16s) ────────────────
    const blinkCycle = t % 3.8;
    const isBlinking = blinkCycle < 0.16;
    if (isHovered || isClicked || mode === "wave") {
      setEyeState("happy");
    } else if (isBlinking) {
      setEyeState("blink");
    } else {
      setEyeState("normal");
    }

    // ── 3. Head Mouse Tracking & Natural Tilt ───────────────────────────────
    if (headRef.current) {
      const targetRotY = mouse.x * 0.42;
      const targetRotX = -mouse.y * 0.24;
      const tiltZ = mode === "tilt" ? Math.sin(t * 1.8) * 0.12 : 0;

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, tiltZ, 0.08);
    }

    // ── 4. Natural Body Breathing & Bounce ──────────────────────────────────
    if (figureGroupRef.current) {
      if (mode === "dance") {
        figureGroupRef.current.position.y = -0.18 + Math.sin(t * 8) * 0.08;
        figureGroupRef.current.rotation.y = Math.sin(t * 4) * 0.22;
      } else if (mode === "walk") {
        figureGroupRef.current.position.y = -0.18 + Math.abs(Math.sin(t * 5)) * 0.04;
        figureGroupRef.current.rotation.y = Math.sin(t * 2.5) * 0.06;
      } else {
        // Natural gentle idle breathing float
        figureGroupRef.current.position.y = -0.18 + Math.sin(t * 2.2) * 0.03;
        figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, 0, 0.08);
      }
    }

    // ── 5. Right Arm (Spontaneous Waving & Resting) ──────────────────────────
    if (rightArmRef.current) {
      if (mode === "dance") {
        rightArmRef.current.rotation.z = -0.5 + Math.sin(t * 8) * 0.4;
        rightArmRef.current.rotation.x = 0.25 + Math.cos(t * 8) * 0.25;
      } else if (mode === "walk") {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.1);
        rightArmRef.current.rotation.x = Math.sin(t * 5) * 0.4;
      } else if (mode === "wave") {
        const waveSpeed = isHovered ? 7.0 : 3.6;
        const waveAmp = isHovered ? 0.36 : 0.24;
        const wave = Math.sin(t * waveSpeed) * waveAmp;
        rightArmRef.current.rotation.z = -0.42 + wave;
        rightArmRef.current.rotation.x = 0.15 + Math.cos(t * 2.5) * 0.08;
      } else {
        // Natural relaxed rest
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.15, 0.08);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.08, 0.08);
      }
    }

    // ── 6. Left Arm (Gently holding candy heart) ─────────────────────────────
    if (leftArmRef.current) {
      if (mode === "dance") {
        leftArmRef.current.rotation.x = 0.15 - Math.cos(t * 8) * 0.22;
      } else if (mode === "walk") {
        leftArmRef.current.rotation.x = 0.12 - Math.sin(t * 5) * 0.3;
      } else {
        leftArmRef.current.rotation.x = 0.08 + Math.sin(t * 1.5) * 0.03;
      }
    }

    // ── 7. Legs (Autonomous stepping) ───────────────────────────────────────
    if (leftLegRef.current && rightLegRef.current) {
      if (mode === "walk" || mode === "dance") {
        const legSpeed = mode === "dance" ? 8 : 5;
        const legAmp = mode === "dance" ? 0.35 : 0.38;
        leftLegRef.current.rotation.x = Math.sin(t * legSpeed) * legAmp;
        rightLegRef.current.rotation.x = -Math.sin(t * legSpeed) * legAmp;
      } else {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  return (
    <group ref={figureGroupRef} position={[0, -0.18, 0]}>
      {/* ── 1. Authentic LEGO Minifigure Head ── */}
      <group ref={headRef} position={[0, 0.94, 0]}>
        {/* Main Head Cylinder */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.74, 0.74, 0.96, 32]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.skinYellow}
            roughness={0.14}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
          />
        </mesh>

        {/* Smooth Rounded Top Rim Cap (Completely solid, zero holes) */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <sphereGeometry args={[0.735, 32, 16]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.skinYellow}
            roughness={0.14}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
          />
        </mesh>

        {/* Classic Center Top Stud */}
        <LegoStud position={[0, 0.88, 0]} color={LEGO_COLORS.skinYellow} scale={[1.1, 0.9, 1.1]} />

        {/* Neck Peg */}
        <mesh position={[0, -0.56, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.18, 24]} />
          <meshPhysicalMaterial color={LEGO_COLORS.skinYellow} roughness={0.18} />
        </mesh>

        {/* ── Anime Face Print on Head ── */}
        {eyeState === "happy" ? (
          // Happy smiling arches (^ ^)
          <>
            <group position={[-0.26, 0.08, 0.74]} rotation={[0, 0, Math.PI]}>
              <mesh>
                <torusGeometry args={[0.085, 0.024, 12, 24, Math.PI]} />
                <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
              </mesh>
            </group>
            <group position={[0.26, 0.08, 0.74]} rotation={[0, 0, Math.PI]}>
              <mesh>
                <torusGeometry args={[0.085, 0.024, 12, 24, Math.PI]} />
                <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
              </mesh>
            </group>
          </>
        ) : eyeState === "blink" ? (
          // Cute horizontal blinking lines (- -)
          <>
            <mesh position={[-0.26, 0.06, 0.74]}>
              <planeGeometry args={[0.16, 0.03]} />
              <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
            </mesh>
            <mesh position={[0.26, 0.06, 0.74]}>
              <planeGeometry args={[0.16, 0.03]} />
              <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
            </mesh>
          </>
        ) : (
          // Big, sparkling anime eyes with double catchlights
          <>
            <group position={[-0.26, 0.06, 0.74]} rotation={[-0.05, -0.08, 0]}>
              <mesh scale={[1, 1.3, 1]}>
                <circleGeometry args={[0.14, 28]} />
                <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
              </mesh>
              <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}>
                <circleGeometry args={[0.11, 24]} />
                <meshBasicMaterial color={LEGO_COLORS.eyeIris} />
              </mesh>
              <mesh position={[-0.04, 0.05, 0.005]}>
                <circleGeometry args={[0.05, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.03, -0.03, 0.005]}>
                <circleGeometry args={[0.025, 14]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>

            <group position={[0.26, 0.06, 0.74]} rotation={[-0.05, 0.08, 0]}>
              <mesh scale={[1, 1.3, 1]}>
                <circleGeometry args={[0.14, 28]} />
                <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
              </mesh>
              <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}>
                <circleGeometry args={[0.11, 24]} />
                <meshBasicMaterial color={LEGO_COLORS.eyeIris} />
              </mesh>
              <mesh position={[-0.04, 0.05, 0.005]}>
                <circleGeometry args={[0.05, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.03, -0.03, 0.005]}>
                <circleGeometry args={[0.025, 14]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          </>
        )}

        {/* Happy Smile Arc */}
        <mesh position={[0, -0.14, 0.74]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.11, 0.022, 12, 24, Math.PI * 0.85]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
        </mesh>

        {/* Rosy Cheek Blush */}
        <mesh position={[-0.42, -0.06, 0.68]} rotation={[-0.08, -0.35, 0]}>
          <circleGeometry args={[0.12, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.42, -0.06, 0.68]} rotation={[-0.08, 0.35, 0]}>
          <circleGeometry args={[0.12, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
        </mesh>
      </group>

      {/* ── 2. Torso ── */}
      <group position={[0, 0.05, 0]}>
        <LegoTorso />

        {/* ── Left Arm (Holding glowing heart) ── */}
        <group ref={leftArmRef} position={[-0.62, 0.52, 0]}>
          {/* Shoulder ball */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
          </mesh>
          {/* Angled Arm Capsule */}
          <mesh position={[0.08, -0.25, 0.14]} rotation={[-0.38, 0.18, -0.26]} castShadow>
            <capsuleGeometry args={[0.13, 0.44, 12, 18]} />
            <meshPhysicalMaterial color={LEGO_COLORS.skinYellow} roughness={0.16} clearcoat={0.9} />
          </mesh>
          {/* Authentic C-Hand */}
          <LegoHand position={[0.16, -0.48, 0.24]} rotation={[-0.4, 0.5, 0.3]} />
          {/* Candy Heart held in hand */}
          <GlowingHeartBrick position={[0.18, -0.38, 0.36]} />
        </group>

        {/* ── Right Arm (Waving hand) ── */}
        <group ref={rightArmRef} position={[0.62, 0.52, 0]}>
          {/* Shoulder ball */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
          </mesh>
          {/* Angled Upper Arm */}
          <mesh position={[0.15, 0.2, 0.06]} rotation={[-0.2, 0, -0.45]} castShadow>
            <capsuleGeometry args={[0.13, 0.48, 12, 18]} />
            <meshPhysicalMaterial color={LEGO_COLORS.skinYellow} roughness={0.16} clearcoat={0.9} />
          </mesh>
          {/* Waving C-Hand */}
          <LegoHand position={[0.3, 0.48, 0.08]} rotation={[0.4, 0.25, -0.65]} />
        </group>
      </group>

      {/* ── 3. Hips & Legs ── */}
      <group position={[0, -0.7, 0]}>
        {/* Hip T-Bar */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[1.22, 0.2, 0.78]} />
          <meshPhysicalMaterial color={LEGO_COLORS.pantsDark} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 1.26, 24]} />
          <meshPhysicalMaterial color={LEGO_COLORS.pantsDark} roughness={0.25} />
        </mesh>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.36, -0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.98, 0.74]} />
            <meshPhysicalMaterial color={LEGO_COLORS.pantsBrown} roughness={0.18} clearcoat={0.85} />
          </mesh>
          {/* Foot Step Cutout */}
          <mesh position={[0, -0.4, 0.2]}>
            <boxGeometry args={[0.52, 0.18, 0.36]} />
            <meshPhysicalMaterial color={LEGO_COLORS.pantsDark} roughness={0.25} />
          </mesh>
          {/* Leg side hole circle for authentic Lego look */}
          <mesh position={[-0.27, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 18]} />
            <meshBasicMaterial color={LEGO_COLORS.pantsDark} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.36, -0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.98, 0.74]} />
            <meshPhysicalMaterial color={LEGO_COLORS.pantsBrown} roughness={0.18} clearcoat={0.85} />
          </mesh>
          {/* Foot Step Cutout */}
          <mesh position={[0, -0.4, 0.2]}>
            <boxGeometry args={[0.52, 0.18, 0.36]} />
            <meshPhysicalMaterial color={LEGO_COLORS.pantsDark} roughness={0.25} />
          </mesh>
          {/* Leg side hole circle */}
          <mesh position={[0.27, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 18]} />
            <meshBasicMaterial color={LEGO_COLORS.pantsDark} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Main Exported Floating LEGO Mascot Component (Clean & Cute, No Text) ───
export interface WalkingBot3DProps {
  onOpenChat?: () => void;
  className?: string;
}

export function WalkingBot3D({ onOpenChat, className = "" }: WalkingBot3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      if (onOpenChat) onOpenChat();
    }, 450);
  };

  return (
    <div className={`fixed bottom-3 right-3 z-50 select-none ${className}`}>
      {/* ── 3D LEGO Mascot Canvas (Clean, Compact, No Text Clutter) ── */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        title="Nhấn để trò chuyện cùng trợ lý ảo WEMO 🧱✨"
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className="relative"
          style={{
            width: 125,
            height: 165,
            background: "transparent",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 0.18, 5.2], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.92} />
            {/* Key Studio Light */}
            <directionalLight position={[4, 7, 5]} intensity={2.0} castShadow />
            {/* Soft Warm Fill Light */}
            <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#FFE6D5" />
            {/* Rim Backlight for Plastic Edges */}
            <directionalLight position={[0, 4, -5]} intensity={1.5} color="#FFDFBA" />
            {/* Soft Pink Bounce from Heart Brick */}
            <pointLight position={[-0.2, -0.3, 0.8]} intensity={1.3} color="#FF4D6D" distance={2.5} />

            {/* Ambient Cute Sparkles */}
            <Sparkles count={16} scale={3.2} size={2.0} speed={0.45} color="#FFB3C6" opacity={0.65} />

            <Float speed={1.8} rotationIntensity={0.04} floatIntensity={0.08}>
              <LegoMinifigureBot isHovered={isHovered} isClicked={isClicked} />
            </Float>

            {/* Ground Contact Shadow */}
            <ContactShadows position={[0, -1.88, 0]} opacity={0.32} scale={2.6} blur={1.6} far={2.5} />
          </Canvas>

          {/* Online green indicator dot */}
          <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

export default WalkingBot3D;
