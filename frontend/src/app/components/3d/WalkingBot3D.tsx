import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";

// ─── High-Tech Pastel Luxury Palette ────────────────────────────────────────
const BOT_COLORS = {
  bodyWhite: "#FFFFFF",        // Pearl White Ceramic
  visorBlack: "#0F172A",       // Glossy Obsidian Visor
  ledCyan: "#38BDF8",          // Sky Blue LED
  ledPink: "#F472B6",          // Soft Neon Pink LED
  roseGold: "#D4AF78",         // Metallic Rose Gold Trims
  wemoCoral: "#E8B4A8",        // WEMO Signature Coral
  heartGlow: "#FF4D6D",        // Heart Core Glow
  metalDark: "#334155",        // Gunmetal joints
};

// ─── Glowing NFC Memory Chip / Heart Core ───────────────────────────────────
function GlowingNfcHeart({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
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
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
  }, [heartShape]);

  return (
    <group position={position} scale={[0.42, 0.42, 0.42]}>
      <mesh geometry={geom} castShadow>
        <meshPhysicalMaterial
          color={BOT_COLORS.heartGlow}
          emissive={BOT_COLORS.heartGlow}
          emissiveIntensity={0.95}
          roughness={0.08}
          transmission={0.88}
          thickness={0.8}
          clearcoat={1.0}
        />
      </mesh>
      {/* Rose Gold NFC Ring */}
      <mesh position={[0, 0, 0.24]}>
        <ringGeometry args={[0.18, 0.24, 24]} />
        <meshBasicMaterial color={BOT_COLORS.roseGold} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Autonomous Cute Chibi Bot with Natural Behaviors ───────────────────────
function AstroBotFigure({
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

    // ── 1. Autonomous Motion Cycle (Smooth 16s timeline) ─────────────────────
    // 0s-6s: Calm idle breathing & looking around
    // 6s-9.5s: Friendly spontaneous wave
    // 9.5s-12.5s: Inquisitive head tilt
    // 12.5s-16s: Light floating bipedal hover step
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

    // ── 2. Realistic Cute Eye Blinking (Every ~3.8s for 0.16s) ──────────────
    const blinkCycle = t % 3.8;
    const isBlinking = blinkCycle < 0.16;
    if (isHovered || isClicked || mode === "wave") {
      setEyeState("happy");
    } else if (isBlinking) {
      setEyeState("blink");
    } else {
      setEyeState("normal");
    }

    // ── 3. Head & Visor Cursor Tracking + Natural Head Tilt ─────────────────
    if (headRef.current) {
      const targetRotY = mouse.x * 0.42;
      const targetRotX = -mouse.y * 0.25;
      const tiltZ = mode === "tilt" ? Math.sin(t * 1.8) * 0.12 : 0;

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, tiltZ, 0.08);
    }

    // ── 4. Natural Body Floating & Breathing ─────────────────────────────────
    if (figureGroupRef.current) {
      if (mode === "dance") {
        figureGroupRef.current.position.y = -0.45 + Math.sin(t * 8) * 0.09;
        figureGroupRef.current.rotation.y = Math.sin(t * 4) * 0.25;
      } else if (mode === "walk") {
        figureGroupRef.current.position.y = -0.45 + Math.abs(Math.sin(t * 5)) * 0.045;
        figureGroupRef.current.rotation.y = Math.sin(t * 2.5) * 0.06;
      } else {
        // Organic breathing hover float
        figureGroupRef.current.position.y = -0.45 + Math.sin(t * 2.2) * 0.035;
        figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, 0, 0.08);
      }
    }

    // ── 5. Right Arm (Spontaneous Waving & Resting) ──────────────────────────
    if (rightArmRef.current) {
      if (mode === "dance") {
        rightArmRef.current.rotation.z = -0.5 + Math.sin(t * 8) * 0.42;
        rightArmRef.current.rotation.x = 0.25 + Math.cos(t * 8) * 0.25;
      } else if (mode === "walk") {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.1);
        rightArmRef.current.rotation.x = Math.sin(t * 5) * 0.38;
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

    // ── 6. Left Arm (Gently holding NFC heart) ──────────────────────────────
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
    <group ref={figureGroupRef} position={[0, -0.45, 0]}>
      {/* ── 1. Futuristic Cute Chibi Robot Head ── */}
      <group ref={headRef} position={[0, 0.9, 0]}>
        {/* Pearl White Ceramic Helmet */}
        <mesh castShadow receiveShadow scale={[1.08, 1.0, 1.04]}>
          <sphereGeometry args={[0.82, 36, 32]} />
          <meshPhysicalMaterial
            color={BOT_COLORS.bodyWhite}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Glossy Obsidian Curved Visor Face */}
        <mesh position={[0, 0.02, 0.45]} scale={[0.88, 0.65, 0.45]}>
          <sphereGeometry args={[0.8, 32, 24]} />
          <meshPhysicalMaterial
            color={BOT_COLORS.visorBlack}
            roughness={0.08}
            metalness={0.8}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Expressive Glowing Digital LED Eyes */}
        {eyeState === "happy" ? (
          // Happy smiling anime arches (^ ^)
          <>
            <group position={[-0.26, 0.06, 0.81]} rotation={[0, 0, Math.PI]}>
              <mesh>
                <torusGeometry args={[0.09, 0.025, 12, 24, Math.PI]} />
                <meshBasicMaterial color={BOT_COLORS.ledPink} />
              </mesh>
            </group>
            <group position={[0.26, 0.06, 0.81]} rotation={[0, 0, Math.PI]}>
              <mesh>
                <torusGeometry args={[0.09, 0.025, 12, 24, Math.PI]} />
                <meshBasicMaterial color={BOT_COLORS.ledPink} />
              </mesh>
            </group>
          </>
        ) : eyeState === "blink" ? (
          // Cute horizontal blink slits (- -)
          <>
            <mesh position={[-0.26, 0.04, 0.81]}>
              <planeGeometry args={[0.18, 0.035]} />
              <meshBasicMaterial color={BOT_COLORS.ledCyan} />
            </mesh>
            <mesh position={[0.26, 0.04, 0.81]}>
              <planeGeometry args={[0.18, 0.035]} />
              <meshBasicMaterial color={BOT_COLORS.ledCyan} />
            </mesh>
          </>
        ) : (
          // Big, bright, cute digital oval eyes with catchlights
          <>
            <group position={[-0.26, 0.04, 0.81]}>
              <mesh scale={[1, 1.35, 1]}>
                <circleGeometry args={[0.1, 24]} />
                <meshBasicMaterial color={BOT_COLORS.ledCyan} />
              </mesh>
              <mesh position={[-0.03, 0.04, 0.005]}>
                <circleGeometry args={[0.035, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
            <group position={[0.26, 0.04, 0.81]}>
              <mesh scale={[1, 1.35, 1]}>
                <circleGeometry args={[0.1, 24]} />
                <meshBasicMaterial color={BOT_COLORS.ledCyan} />
              </mesh>
              <mesh position={[-0.03, 0.04, 0.005]}>
                <circleGeometry args={[0.035, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          </>
        )}

        {/* Soft Rose Cheek LED Blushes */}
        <mesh position={[-0.42, -0.12, 0.72]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color={BOT_COLORS.ledPink} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.42, -0.12, 0.72]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color={BOT_COLORS.ledPink} transparent opacity={0.65} />
        </mesh>

        {/* Side Ear Pucks / Audio Sensors with Rose Gold Ring */}
        <group position={[-0.88, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
            <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, -0.065, 0]}>
            <ringGeometry args={[0.12, 0.2, 24]} />
            <meshBasicMaterial color={BOT_COLORS.roseGold} side={THREE.DoubleSide} />
          </mesh>
        </group>
        <group position={[0.88, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
            <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, -0.065, 0]}>
            <ringGeometry args={[0.12, 0.2, 24]} />
            <meshBasicMaterial color={BOT_COLORS.roseGold} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Cute Top Halo Antenna */}
        <group position={[0, 0.88, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshPhysicalMaterial color={BOT_COLORS.roseGold} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshPhysicalMaterial
              color={BOT_COLORS.ledCyan}
              emissive={BOT_COLORS.ledCyan}
              emissiveIntensity={1.2}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>

      {/* ── 2. Seamless Capsule Body ── */}
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.52, 0.58, 16, 32]} />
          <meshPhysicalMaterial
            color={BOT_COLORS.bodyWhite}
            roughness={0.14}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
          />
        </mesh>

        {/* Rose Gold Collar Trim */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.48, 0.035, 12, 32]} />
          <meshPhysicalMaterial color={BOT_COLORS.roseGold} metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Glowing Heart Core on Chest */}
        <group position={[0, 0.05, 0.48]}>
          <mesh>
            <circleGeometry args={[0.22, 28]} />
            <meshBasicMaterial color={BOT_COLORS.metalDark} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.16, 24]} />
            <meshPhysicalMaterial
              color={BOT_COLORS.heartGlow}
              emissive={BOT_COLORS.heartGlow}
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>

        {/* WEMO Mini Brand Tag */}
        <mesh position={[0, -0.22, 0.5]}>
          <planeGeometry args={[0.34, 0.1]} />
          <meshBasicMaterial color={BOT_COLORS.roseGold} />
        </mesh>
      </group>

      {/* ── 3. Seamless Left Arm (Holding NFC Heart Crystal) ── */}
      <group ref={leftArmRef} position={[-0.56, 0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshPhysicalMaterial color={BOT_COLORS.roseGold} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0.1, -0.22, 0.12]} rotation={[-0.35, 0.2, -0.25]} castShadow>
          <capsuleGeometry args={[0.12, 0.42, 12, 20]} />
          <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
        </mesh>
        <mesh position={[0.16, -0.42, 0.22]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshPhysicalMaterial color={BOT_COLORS.roseGold} metalness={0.7} roughness={0.25} />
        </mesh>
        <GlowingNfcHeart position={[0.16, -0.32, 0.35]} />
      </group>

      {/* ── 4. Seamless Right Arm (Waving Cheerful Hand) ── */}
      <group ref={rightArmRef} position={[0.56, 0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshPhysicalMaterial color={BOT_COLORS.roseGold} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0.15, 0.18, 0.06]} rotation={[-0.2, 0, -0.45]} castShadow>
          <capsuleGeometry args={[0.12, 0.46, 12, 20]} />
          <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
        </mesh>
        <mesh position={[0.28, 0.44, 0.08]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
        </mesh>
      </group>

      {/* ── 5. Seamless Robotic Biped Legs ── */}
      <group position={[0, -0.48, 0]}>
        <group ref={leftLegRef} position={[-0.26, -0.16, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.16, 0.36, 12, 20]} />
            <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, -0.22, 0.04]} scale={[1.05, 0.55, 1.15]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshPhysicalMaterial
              color={BOT_COLORS.ledCyan}
              emissive={BOT_COLORS.ledCyan}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.26, -0.16, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.16, 0.36, 12, 20]} />
            <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
          </mesh>
          <mesh position={[0, -0.22, 0.04]} scale={[1.05, 0.55, 1.15]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshPhysicalMaterial
              color={BOT_COLORS.ledCyan}
              emissive={BOT_COLORS.ledCyan}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      </group>

      {/* ── 6. Floating Holographic Pedestal ── */}
      <group position={[0, -1.18, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[1.2, 1.35, 0.14, 32]} />
          <meshPhysicalMaterial
            color="#0F172A"
            roughness={0.2}
            metalness={0.6}
            clearcoat={0.8}
          />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.95, 32]} />
          <meshBasicMaterial color={BOT_COLORS.wemoCoral} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Main Exported Floating Mascot Component (Clean & Cute, No Text) ────────
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
      {/* ── 3D Mascot Interactive Canvas (Clean, Compact, Cute & No Text) ── */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        title="Nhấn để trò chuyện cùng trợ lý ảo WEMO ✨"
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
            camera={{ position: [0, 0.15, 5.0], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.92} />
            {/* Key Studio Light */}
            <directionalLight position={[4, 7, 5]} intensity={2.0} castShadow />
            {/* Soft Warm Fill */}
            <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#FFE6D5" />
            {/* Rim Backlight */}
            <directionalLight position={[0, 4, -5]} intensity={1.5} color="#FFDFBA" />
            {/* Soft Pink Glow from Heart */}
            <pointLight position={[-0.2, -0.3, 0.8]} intensity={1.3} color="#FF4D6D" distance={2.5} />

            {/* Ambient Cute Sparkles */}
            <Sparkles count={16} scale={3.2} size={2.0} speed={0.45} color="#FFB3C6" opacity={0.65} />

            <Float speed={1.8} rotationIntensity={0.04} floatIntensity={0.08}>
              <AstroBotFigure isHovered={isHovered} isClicked={isClicked} />
            </Float>

            {/* Ground Contact Shadow */}
            <ContactShadows position={[0, -1.8, 0]} opacity={0.42} scale={4.0} blur={1.8} far={3} />
          </Canvas>

          {/* Online green indicator dot */}
          <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

export default WalkingBot3D;
