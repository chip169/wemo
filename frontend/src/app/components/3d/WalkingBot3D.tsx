import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles as SparklesIcon, X } from "lucide-react";

// ─── LEGO Color Palette (Authentic ABS Plastic) ─────────────────────────────
const LEGO_COLORS = {
  bearBrown: "#C27E3B",       // Warm Golden Caramel ABS Plastic
  bearDarkBrown: "#8A4D1A",   // Rich chocolate accents
  creamBelly: "#FCECD2",      // Creamy muzzle & chest
  pinkHeart: "#FF6584",       // Translucent candy heart
  shirtWhite: "#FFFFFF",      // High-gloss White tee
  eyeBlack: "#18100C",        // Glossy black pupil
  eyeIris: "#5A3010",         // Warm amber eye iris
  cheeks: "#FF8A7A",          // Soft rosy blush
  studGold: "#E5A93C",        // Gold studs
};

// ─── Reusable Lego Stud Component ───────────────────────────────────────────
function LegoStud({ position, rotation = [0, 0, 0], scale = [1, 1, 1], color = LEGO_COLORS.bearBrown }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.18, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ─── Lego C-Hand Component ──────────────────────────────────────────────────
function LegoHand({ position, rotation = [0, 0, 0], color = LEGO_COLORS.bearBrown }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.3, 16]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.1, 16, 28, Math.PI * 1.45]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          clearcoat={0.85}
        />
      </mesh>
    </group>
  );
}

// ─── Procedural Trapezoid Torso ─────────────────────────────────────────────
function LegoTorso({ color = LEGO_COLORS.shirtWhite }: { color?: string }) {
  const torsoGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const topW = 0.95;
    const botW = 1.25;
    const h = 1.6;

    shape.moveTo(-botW / 2, -h / 2);
    shape.lineTo(botW / 2, -h / 2);
    shape.lineTo(topW / 2, h / 2);
    shape.lineTo(-topW / 2, h / 2);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.85,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  return (
    <group>
      <mesh geometry={torsoGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.22}
          clearcoat={0.8}
          clearcoatRoughness={0.12}
        />
      </mesh>

      {/* Cream Belly Patch */}
      <mesh position={[0, -0.05, 0.46]}>
        <planeGeometry args={[0.8, 1.1]} />
        <meshBasicMaterial color={LEGO_COLORS.creamBelly} transparent opacity={0.9} />
      </mesh>

      {/* "WEMO" subtle logo badge on chest */}
      <mesh position={[0, 0.28, 0.465]}>
        <planeGeometry args={[0.55, 0.22]} />
        <meshBasicMaterial color="#5C352E" />
      </mesh>
      <mesh position={[0, 0.28, 0.47]}>
        <planeGeometry args={[0.48, 0.15]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// ─── Lego Head with Solid Dome & Adorable Bear Features ──────────────────────
function LegoHead({ headRef }: { headRef: React.RefObject<THREE.Group> }) {
  return (
    <group ref={headRef} position={[0, 1.35, 0]}>
      {/* Neck connector cylinder */}
      <mesh position={[0, -0.68, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.4, 0.28, 24]} />
        <meshPhysicalMaterial
          color={LEGO_COLORS.bearBrown}
          roughness={0.2}
          clearcoat={0.9}
        />
      </mesh>

      {/* Main Minifigure Cylindrical Head */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.82, 1.12, 32]} />
        <meshPhysicalMaterial
          color={LEGO_COLORS.bearBrown}
          roughness={0.18}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Head Top Smooth Curve — Solid sphere half inside cylinder, no hollow gap */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.81, 32, 18]} />
        <meshPhysicalMaterial
          color={LEGO_COLORS.bearBrown}
          roughness={0.18}
          clearcoat={0.95}
        />
      </mesh>

      {/* Classic Center Top Stud — solidly positioned on dome */}
      <LegoStud position={[0, 0.88, 0]} color={LEGO_COLORS.bearBrown} scale={[1.1, 0.85, 1.1]} />

      {/* ── Left Bear Ear with Lego Stud ── */}
      <group position={[-0.72, 0.62, 0]} rotation={[0, 0, 0.35]}>
        <mesh castShadow>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearBrown}
            roughness={0.2}
            clearcoat={0.9}
          />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <circleGeometry args={[0.18, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.creamBelly} />
        </mesh>
        <LegoStud position={[0, 0.32, 0]} color={LEGO_COLORS.bearBrown} scale={[0.75, 0.75, 0.75]} />
      </group>

      {/* ── Right Bear Ear with Lego Stud ── */}
      <group position={[0.72, 0.62, 0]} rotation={[0, 0, -0.35]}>
        <mesh castShadow>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearBrown}
            roughness={0.2}
            clearcoat={0.9}
          />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <circleGeometry args={[0.18, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.creamBelly} />
        </mesh>
        <LegoStud position={[0, 0.32, 0]} color={LEGO_COLORS.bearBrown} scale={[0.75, 0.75, 0.75]} />
      </group>

      {/* ── Cute Flattened Snout & Smile ── */}
      <group position={[0, -0.06, 0.72]}>
        {/* Flattened Cream Muzzle */}
        <mesh castShadow scale={[1.15, 0.88, 0.6]}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.creamBelly}
            roughness={0.25}
            clearcoat={0.7}
          />
        </mesh>

        {/* Chocolate Button Nose */}
        <mesh position={[0, 0.12, 0.26]} scale={[1.2, 0.85, 0.8]}>
          <sphereGeometry args={[0.13, 18, 18]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearDarkBrown}
            roughness={0.15}
            clearcoat={1.0}
          />
        </mesh>

        {/* Happy Smile Arc */}
        <mesh position={[0, -0.08, 0.26]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.13, 0.024, 12, 24, Math.PI * 0.85]} />
          <meshBasicMaterial color={LEGO_COLORS.bearDarkBrown} />
        </mesh>
      </group>

      {/* ── Sparkling Anime Eyes ── */}
      {/* Left Eye */}
      <group position={[-0.34, 0.16, 0.78]} rotation={[-0.05, -0.15, 0]}>
        <mesh scale={[1, 1.25, 1]}>
          <circleGeometry args={[0.18, 28]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
        </mesh>
        <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}>
          <circleGeometry args={[0.14, 24]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeIris} />
        </mesh>
        <mesh position={[-0.05, 0.07, 0.005]}>
          <circleGeometry args={[0.065, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.05, -0.05, 0.005]}>
          <circleGeometry args={[0.035, 14]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.34, 0.16, 0.78]} rotation={[-0.05, 0.15, 0]}>
        <mesh scale={[1, 1.25, 1]}>
          <circleGeometry args={[0.18, 28]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
        </mesh>
        <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}>
          <circleGeometry args={[0.14, 24]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeIris} />
        </mesh>
        <mesh position={[-0.05, 0.07, 0.005]}>
          <circleGeometry args={[0.065, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.05, -0.05, 0.005]}>
          <circleGeometry args={[0.035, 14]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Rosy Cheeks */}
      <mesh position={[-0.52, -0.05, 0.68]} rotation={[-0.1, -0.4, 0]}>
        <circleGeometry args={[0.16, 20]} />
        <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0.52, -0.05, 0.68]} rotation={[-0.1, 0.4, 0]}>
        <circleGeometry args={[0.16, 20]} />
        <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ─── Translucent Glowing Heart Brick ────────────────────────────────────────
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
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
  }, [heartShape]);

  return (
    <group position={position} scale={[0.48, 0.48, 0.48]}>
      <mesh geometry={geom} castShadow>
        <meshPhysicalMaterial
          color={LEGO_COLORS.pinkHeart}
          emissive={LEGO_COLORS.pinkHeart}
          emissiveIntensity={0.65}
          roughness={0.08}
          transmission={0.8}
          thickness={0.8}
          clearcoat={1.0}
        />
      </mesh>
      <LegoStud position={[-0.32, 0.6, 0.15]} color={LEGO_COLORS.pinkHeart} scale={[0.6, 0.6, 0.6]} />
      <LegoStud position={[0.32, 0.6, 0.15]} color={LEGO_COLORS.pinkHeart} scale={[0.6, 0.6, 0.6]} />
    </group>
  );
}

// ─── Real-time Animated Figure ──────────────────────────────────────────────
function RealtimeLegoFigure({
  isHovered,
  motionMode,
}: {
  isHovered: boolean;
  motionMode: "wave" | "walk" | "dance";
}) {
  const figureGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const { mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Mouse Head Tracking
    if (headRef.current) {
      const targetRotY = mouse.x * 0.45;
      const targetRotX = -mouse.y * 0.28;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
    }

    // 2. Body Motions
    if (figureGroupRef.current) {
      if (motionMode === "dance") {
        figureGroupRef.current.position.y = -0.55 + Math.sin(t * 8) * 0.08;
        figureGroupRef.current.rotation.y = Math.sin(t * 4) * 0.22;
      } else if (motionMode === "walk") {
        figureGroupRef.current.position.y = -0.55 + Math.abs(Math.sin(t * 5)) * 0.05;
        figureGroupRef.current.rotation.y = Math.sin(t * 2.5) * 0.07;
      } else {
        // Breathing bob
        figureGroupRef.current.position.y = -0.55 + Math.sin(t * 2) * 0.035;
        figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, 0, 0.08);
      }
    }

    // 3. Right Arm (Waving)
    if (rightArmRef.current) {
      if (motionMode === "dance") {
        rightArmRef.current.rotation.z = -0.45 + Math.sin(t * 8) * 0.4;
        rightArmRef.current.rotation.x = 0.25 + Math.cos(t * 8) * 0.25;
      } else if (motionMode === "walk") {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.15, 0.1);
        rightArmRef.current.rotation.x = Math.sin(t * 5) * 0.4;
      } else {
        const waveSpeed = isHovered ? 6.5 : 3.2;
        const waveAmp = isHovered ? 0.36 : 0.22;
        const wave = Math.sin(t * waveSpeed) * waveAmp;
        rightArmRef.current.rotation.z = -0.45 + wave;
        rightArmRef.current.rotation.x = 0.18 + Math.cos(t * 2.5) * 0.08;
      }
    }

    // 4. Left Arm (Holding heart)
    if (leftArmRef.current) {
      if (motionMode === "dance") {
        leftArmRef.current.rotation.x = 0.15 - Math.cos(t * 8) * 0.25;
      } else if (motionMode === "walk") {
        leftArmRef.current.rotation.x = 0.15 - Math.sin(t * 5) * 0.3;
      } else {
        leftArmRef.current.rotation.x = 0.12 + Math.sin(t * 1.5) * 0.04;
      }
    }

    // 5. Legs
    if (leftLegRef.current && rightLegRef.current) {
      if (motionMode === "walk" || motionMode === "dance") {
        const legSpeed = motionMode === "dance" ? 8 : 5;
        const legAmp = motionMode === "dance" ? 0.35 : 0.42;
        leftLegRef.current.rotation.x = Math.sin(t * legSpeed) * legAmp;
        rightLegRef.current.rotation.x = -Math.sin(t * legSpeed) * legAmp;
      } else {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  return (
    <group ref={figureGroupRef} position={[0, -0.55, 0]}>
      {/* ── Head ── */}
      <LegoHead headRef={headRef as any} />

      {/* ── Torso ── */}
      <group position={[0, 0.18, 0]}>
        <LegoTorso />

        {/* ── Left Arm (Holding glowing heart brick gracefully) ── */}
        <group ref={leftArmRef} position={[-0.68, 0.52, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
          </mesh>
          <mesh position={[0.08, -0.28, 0.15]} rotation={[-0.4, 0.2, -0.3]}>
            <cylinderGeometry args={[0.14, 0.16, 0.55, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} />
          </mesh>
          <LegoHand position={[0.15, -0.52, 0.28]} rotation={[-0.5, 0.6, 0.3]} />
          <GlowingHeartBrick position={[0.18, -0.42, 0.42]} />
        </group>

        {/* ── Right Arm (Waving cheerfully) ── */}
        <group ref={rightArmRef} position={[0.68, 0.52, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
          </mesh>
          <mesh position={[0.18, 0.22, 0.08]} rotation={[-0.2, 0, -0.5]}>
            <cylinderGeometry args={[0.14, 0.16, 0.62, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} />
          </mesh>
          <LegoHand position={[0.34, 0.54, 0.12]} rotation={[0.4, 0.3, -0.7]} />
        </group>
      </group>

      {/* ── Hips & Legs ── */}
      <group position={[0, -0.72, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[1.3, 0.24, 0.88]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 1.34, 24]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
        </mesh>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.38, -0.55, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.1, 0.82]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} />
          </mesh>
          <mesh position={[0, -0.44, 0.22]} castShadow>
            <boxGeometry args={[0.56, 0.22, 0.4]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.38, -0.55, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.1, 0.82]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} />
          </mesh>
          <mesh position={[0, -0.44, 0.22]} castShadow>
            <boxGeometry args={[0.56, 0.22, 0.4]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* ── Circular Lego Baseplate ── */}
      <group position={[0, -1.9, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[1.75, 1.85, 0.22, 36]} />
          <meshPhysicalMaterial color="#3E2723" roughness={0.4} clearcoat={0.6} />
        </mesh>
        {[-0.9, -0.3, 0.3, 0.9].map((x, i) =>
          [-0.7, 0, 0.7].map((z, j) => (
            <LegoStud
              key={`${i}-${j}`}
              position={[x, 0.14, z]}
              color="#3E2723"
              scale={[0.65, 0.55, 0.65]}
            />
          ))
        )}
      </group>
    </group>
  );
}

// ─── Main Exported Floating Mascot Component ────────────────────────────────
export interface WalkingBot3DProps {
  onOpenChat?: () => void;
  className?: string;
}

export function WalkingBot3D({ onOpenChat, className = "" }: WalkingBot3DProps) {
  const [motionMode, setMotionMode] = useState<"wave" | "walk" | "dance">("wave");
  const [isHovered, setIsHovered] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const [speechBubble, setSpeechBubble] = useState("Chào bạn! Tớ là gấu LEGO WEMO 🧱");

  const handlePointerEnter = () => {
    setIsHovered(true);
    setSpeechBubble("Chào bạn! Bạn cần WEMO hỗ trợ gì ạ? 👋");
    setShowSpeech(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    setMotionMode("dance");
    setSpeechBubble("Mở khung chat hỗ trợ ngay nhé! ✨");
    setTimeout(() => {
      if (onOpenChat) onOpenChat();
    }, 550);
  };

  return (
    <div className={`fixed bottom-3 right-3 z-50 select-none ${className}`}>
      {/* ── Speech Bubble positioned neatly to the LEFT of character ── */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            className="absolute right-[142px] bottom-[48px] w-[185px] p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8B4A8]/45 shadow-xl text-stone-800 text-[11px] font-semibold cursor-pointer z-50"
            onClick={handleClick}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[9.5px] font-black uppercase text-[#D4AF78] flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 text-[#E8B4A8]" /> WEMO Bot 🧱
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeech(false);
                }}
                className="text-stone-400 hover:text-stone-600 p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="leading-snug text-stone-700 text-[11.5px]">{speechBubble}</p>

            {/* Triangle pointer pointing RIGHT towards the character */}
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white rotate-45 border-t border-r border-[#E8B4A8]/45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3D Mascot Interactive Canvas (Compact Size: 135x175px) ── */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <div
          className="relative transition-transform duration-300 group-hover:scale-105"
          style={{
            width: 135,
            height: 175,
            background: "transparent",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 0.25, 5.8], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.95} />
            <directionalLight position={[4, 7, 5]} intensity={1.9} castShadow />
            <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#FFE6D5" />
            <directionalLight position={[0, 4, -5]} intensity={1.5} color="#FFDFBA" />
            <pointLight position={[-0.3, -0.6, 0.8]} intensity={1.2} color="#FF6584" distance={2.5} />

            <Sparkles count={20} scale={3.6} size={2.2} speed={0.5} color="#FFB3C6" opacity={0.7} />

            <Float speed={1.8} rotationIntensity={0.06} floatIntensity={0.1}>
              <RealtimeLegoFigure isHovered={isHovered} motionMode={motionMode} />
            </Float>

            <ContactShadows position={[0, -2.45, 0]} opacity={0.45} scale={4.5} blur={2.0} far={3.5} />
          </Canvas>

          {/* Quick Motion Switcher Chip */}
          <div className="absolute top-1 right-1 flex items-center gap-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMotionMode((prev) => (prev === "wave" ? "walk" : prev === "walk" ? "dance" : "wave"));
                setSpeechBubble(
                  motionMode === "wave"
                    ? "Tớ đang bước đi dạo đây! 🚶"
                    : motionMode === "walk"
                    ? "Nhảy múa vui vẻ nào! 💃"
                    : "Chào bạn thân yêu! 👋"
                );
                setShowSpeech(true);
              }}
              className="p-1 px-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-sm border border-stone-200/80 transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              title="Đổi động tác (Vẫy tay / Đi dạo / Nhảy múa)"
            >
              <SparklesIcon className="w-3 h-3 text-[#D4AF78]" />
              <span className="text-[9.5px] font-bold text-stone-600">
                {motionMode === "wave" ? "Vẫy tay" : motionMode === "walk" ? "Đi dạo" : "Nhảy"}
              </span>
            </button>
          </div>

          {/* Online status indicator */}
          <span className="absolute bottom-2.5 right-3 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default WalkingBot3D;
