import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles as SparklesIcon, X, Minimize2, Heart } from "lucide-react";

// ─── LEGO Color Palette (Authentic ABS Plastic) ─────────────────────────────
const LEGO_COLORS = {
  bearBrown: "#BD7A36",       // Warm Caramel ABS Plastic
  bearDarkBrown: "#8F531B",   // Shading / Nose / Back
  creamBelly: "#FCECD2",      // Creamy chest & muzzle
  pinkHeart: "#FF6584",       // Translucent candy heart
  shirtWhite: "#FFFFFF",      // WEMO studio tee
  eyeBlack: "#18100C",        // Glossy black eye pupil
  eyeIris: "#5A3010",         // Warm amber eye iris
  cheeks: "#FF8A7A",          // Rosy cheek blush
  studGold: "#E5A93C",        // Accent studs
};

// ─── Lego Stud Component ────────────────────────────────────────────────────
function LegoStud({ position, color = LEGO_COLORS.bearBrown, scale = [1, 1, 1] }: {
  position: [number, number, number];
  color?: string;
  scale?: [number, number, number];
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.16} clearcoat={0.9} />
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
        <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.1, 16, 28, Math.PI * 1.45]} />
        <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={0.85} />
      </mesh>
    </group>
  );
}

// ─── Procedural Torso ───────────────────────────────────────────────────────
function LegoTorso() {
  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    const topW = 0.95, botW = 1.25, h = 1.6;
    shape.moveTo(-botW / 2, -h / 2);
    shape.lineTo(botW / 2, -h / 2);
    shape.lineTo(topW / 2, h / 2);
    shape.lineTo(-topW / 2, h / 2);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.85,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });
  }, []);

  return (
    <group position={[0, 0, -0.42]}>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.15} clearcoat={0.9} />
      </mesh>
      {/* Front Tee Decal / Heart Accent */}
      <mesh position={[0, 0.05, 0.92]}>
        <circleGeometry args={[0.28, 24]} />
        <meshBasicMaterial color="#FFF1EE" />
      </mesh>
      <mesh position={[0, 0.05, 0.93]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color="#E8B4A8" />
      </mesh>
    </group>
  );
}

// ─── Glowing Heart Accessory ────────────────────────────────────────────────
function GlowingHeartBrick({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.25);
    s.bezierCurveTo(0, 0.35, -0.25, 0.55, -0.45, 0.55);
    s.bezierCurveTo(-0.75, 0.55, -0.75, 0.2, -0.75, 0.2);
    s.bezierCurveTo(-0.75, -0.05, -0.5, -0.3, 0, -0.65);
    s.bezierCurveTo(0.5, -0.3, 0.75, -0.05, 0.75, 0.2);
    s.bezierCurveTo(0.75, 0.2, 0.75, 0.55, 0.45, 0.55);
    s.bezierCurveTo(0.25, 0.55, 0, 0.35, 0, 0.25);
    return new THREE.ExtrudeGeometry(s, { depth: 0.28, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 });
  }, []);

  return (
    <group position={position} scale={[0.48, 0.48, 0.48]}>
      <mesh geometry={geom} castShadow>
        <meshPhysicalMaterial color={LEGO_COLORS.pinkHeart} emissive={LEGO_COLORS.pinkHeart} emissiveIntensity={0.55} roughness={0.08} clearcoat={1.0} />
      </mesh>
    </group>
  );
}

// ─── Lego Head ──────────────────────────────────────────────────────────────
function LegoHead({ headRef }: { headRef: React.RefObject<THREE.Group> }) {
  return (
    <group ref={headRef} position={[0, 1.45, 0]}>
      {/* Head Cylinder Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.82, 1.15, 32]} />
        <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.15} clearcoat={0.9} />
      </mesh>
      {/* Top Stud on Head */}
      <LegoStud position={[0, 0.65, 0]} color={LEGO_COLORS.bearBrown} scale={[1.2, 1, 1.2]} />

      {/* Round Bear Ears with Studs */}
      <group position={[-0.85, 0.75, 0]} rotation={[0, 0, 0.5]}>
        <mesh castShadow>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.16} clearcoat={0.9} />
        </mesh>
        <LegoStud position={[0, 0.28, 0]} color={LEGO_COLORS.bearDarkBrown} scale={[0.7, 0.7, 0.7]} />
      </group>
      <group position={[0.85, 0.75, 0]} rotation={[0, 0, -0.5]}>
        <mesh castShadow>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.16} clearcoat={0.9} />
        </mesh>
        <LegoStud position={[0, 0.28, 0]} color={LEGO_COLORS.bearDarkBrown} scale={[0.7, 0.7, 0.7]} />
      </group>

      {/* Cream Muzzle / Snout */}
      <group position={[0, -0.15, 0.72]}>
        <mesh castShadow>
          <sphereGeometry args={[0.42, 24, 16]} />
          <meshPhysicalMaterial color={LEGO_COLORS.creamBelly} roughness={0.2} clearcoat={0.8} />
        </mesh>
        {/* Nose button */}
        <mesh position={[0, 0.12, 0.28]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshBasicMaterial color={LEGO_COLORS.bearDarkBrown} />
        </mesh>
        {/* Cute Smile Arc */}
        <mesh position={[0, -0.06, 0.32]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.07, 0.1, 16, 1, Math.PI, Math.PI]} />
          <meshBasicMaterial color={LEGO_COLORS.bearDarkBrown} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Anime Eyes */}
      <group position={[-0.34, 0.16, 0.78]} rotation={[-0.05, -0.15, 0]}>
        <mesh scale={[1, 1.25, 1]}><circleGeometry args={[0.18, 28]} /><meshBasicMaterial color={LEGO_COLORS.eyeBlack} /></mesh>
        <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}><circleGeometry args={[0.14, 24]} /><meshBasicMaterial color={LEGO_COLORS.eyeIris} /></mesh>
        <mesh position={[-0.05, 0.07, 0.005]}><circleGeometry args={[0.065, 16]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0.05, -0.05, 0.005]}><circleGeometry args={[0.035, 14]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
      </group>
      <group position={[0.34, 0.16, 0.78]} rotation={[-0.05, 0.15, 0]}>
        <mesh scale={[1, 1.25, 1]}><circleGeometry args={[0.18, 28]} /><meshBasicMaterial color={LEGO_COLORS.eyeBlack} /></mesh>
        <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}><circleGeometry args={[0.14, 24]} /><meshBasicMaterial color={LEGO_COLORS.eyeIris} /></mesh>
        <mesh position={[-0.05, 0.07, 0.005]}><circleGeometry args={[0.065, 16]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0.05, -0.05, 0.005]}><circleGeometry args={[0.035, 14]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
      </group>

      {/* Rosy Cheeks */}
      <mesh position={[-0.52, -0.05, 0.68]} rotation={[-0.1, -0.4, 0]}><circleGeometry args={[0.16, 20]} /><meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} /></mesh>
      <mesh position={[0.52, -0.05, 0.68]} rotation={[-0.1, 0.4, 0]}><circleGeometry args={[0.16, 20]} /><meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} /></mesh>
    </group>
  );
}

// ─── Animated Lego Minifigure Figure with Procedural Walking ────────────────
function AnimatedLegoFigure({ isWalking, isWaving }: { isWalking: boolean; isWaving: boolean }) {
  const figureRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const { mouse } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Head tracking mouse smoothly
    if (headRef.current) {
      const targetRotY = mouse.x * 0.45;
      const targetRotX = -mouse.y * 0.25;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
    }

    // 2. Walking mechanics
    if (isWalking) {
      const walkFreq = 5.5;
      const legAngle = Math.sin(t * walkFreq) * 0.55;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;

      if (leftArmRef.current) leftArmRef.current.rotation.x = -legAngle * 0.65;
      if (rightArmRef.current && !isWaving) {
        rightArmRef.current.rotation.x = legAngle * 0.65;
        rightArmRef.current.rotation.z = -0.2;
      }

      // Vertical bounce per step
      if (figureRef.current) {
        figureRef.current.position.y = -0.45 + Math.abs(Math.sin(t * walkFreq)) * 0.08;
      }
    } else {
      // Idle return
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, delta * 6);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, delta * 6);
      if (figureRef.current) figureRef.current.position.y = -0.45 + Math.sin(t * 2) * 0.04;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.15 + Math.sin(t * 1.5) * 0.05;
    }

    // 3. Cheerful waving arm
    if (isWaving && rightArmRef.current) {
      const wave = Math.sin(t * 5.5) * 0.32;
      rightArmRef.current.rotation.z = -0.55 + wave;
      rightArmRef.current.rotation.x = 0.35 + Math.cos(t * 3) * 0.1;
    } else if (!isWalking && rightArmRef.current) {
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, delta * 4);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.2, delta * 4);
    }
  });

  return (
    <group ref={figureRef} position={[0, -0.45, 0]}>
      {/* Head */}
      <LegoHead headRef={headRef as any} />

      {/* Torso */}
      <group position={[0, 0.18, 0]}>
        <LegoTorso />

        {/* Left Arm holding glowing heart */}
        <group ref={leftArmRef} position={[-0.72, 0.55, 0]}>
          <mesh><sphereGeometry args={[0.22, 16, 16]} /><meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} /></mesh>
          <mesh position={[-0.15, -0.45, 0.22]} rotation={[0.45, 0, 0.2]}><cylinderGeometry args={[0.16, 0.18, 0.75, 18]} /><meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} /></mesh>
          <LegoHand position={[-0.24, -0.85, 0.42]} rotation={[-0.3, 0.4, 0.5]} />
          <GlowingHeartBrick position={[-0.24, -0.75, 0.65]} />
        </group>

        {/* Right Arm (Waving) */}
        <group ref={rightArmRef} position={[0.72, 0.55, 0]}>
          <mesh><sphereGeometry args={[0.22, 16, 16]} /><meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} /></mesh>
          <mesh position={[0.22, 0.25, 0.1]} rotation={[-0.3, 0, -0.55]}><cylinderGeometry args={[0.16, 0.18, 0.75, 18]} /><meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} /></mesh>
          <LegoHand position={[0.42, 0.62, 0.15]} rotation={[0.5, 0.4, -0.8]} />
        </group>
      </group>

      {/* Hips & Legs */}
      <group position={[0, -0.72, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow><boxGeometry args={[1.3, 0.24, 0.88]} /><meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} /></mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.36, 0.36, 1.34, 24]} /><meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} /></mesh>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.38, 0, 0]}>
          <mesh position={[0, -0.55, 0]} castShadow receiveShadow><boxGeometry args={[0.56, 1.1, 0.82]} /><meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} /></mesh>
          <mesh position={[0, -0.98, 0.22]} castShadow><boxGeometry args={[0.56, 0.22, 0.4]} /><meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} /></mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.38, 0, 0]}>
          <mesh position={[0, -0.55, 0]} castShadow receiveShadow><boxGeometry args={[0.56, 1.1, 0.82]} /><meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} /></mesh>
          <mesh position={[0, -0.98, 0.22]} castShadow><boxGeometry args={[0.56, 0.22, 0.4]} /><meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} /></mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Interactive Walking Lego Bot Overlay ───────────────────────────────────
export interface WalkingBot3DProps {
  onOpenChat?: () => void;
  onToggleMode?: () => void;
  className?: string;
}

export function WalkingBot3D({ onOpenChat, onToggleMode, className = "" }: WalkingBot3DProps) {
  const [isWalking, setIsWalking] = useState(false);
  const [isWaving, setIsWaving] = useState(true);
  const [speechBubble, setSpeechBubble] = useState("Chào bạn! Tớ là gấu LEGO WEMO 🧱");
  const [showSpeech, setShowSpeech] = useState(true);

  const handlePointerEnter = () => {
    setIsWaving(true);
    setSpeechBubble("Bạn cần WEMO hỗ trợ gì không ạ? 👋");
    setShowSpeech(true);
  };

  const handlePointerLeave = () => {
    if (!isWalking) setIsWaving(false);
  };

  const handleClick = () => {
    if (onOpenChat) onOpenChat();
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-end select-none ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="mb-2 mr-6 max-w-[210px] p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8B4A8]/40 shadow-xl text-stone-800 text-xs font-semibold relative cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-black uppercase text-[#D4AF78] flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 text-[#E8B4A8]" /> WEMO LEGO Bot
              </span>
              <button onClick={(e) => { e.stopPropagation(); setShowSpeech(false); }} className="text-stone-400 hover:text-stone-600 p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="leading-snug text-stone-700">{speechBubble}</p>
            <div className="absolute -bottom-1.5 right-12 w-3 h-3 bg-white rotate-45 border-r border-b border-[#E8B4A8]/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Lego Figure Container */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <div
          className="relative rounded-3xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
          style={{
            width: 170,
            height: 200,
            background: "radial-gradient(circle at 50% 65%, rgba(232,180,168,0.25) 0%, transparent 72%)",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 0.2, 5.2], fov: 36 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[3, 5, 4]} intensity={1.8} castShadow />
            <directionalLight position={[-3, 3, 2]} intensity={0.9} color="#FFE6D5" />
            <directionalLight position={[0, 4, -4]} intensity={1.3} color="#FFDFBA" />

            <Sparkles count={20} scale={3.5} size={2} speed={0.5} color="#FFB3C6" opacity={0.6} />

            <AnimatedLegoFigure isWalking={isWalking} isWaving={isWaving} />

            <ContactShadows position={[0, -1.8, 0]} opacity={0.55} scale={4} blur={1.5} far={3} />
          </Canvas>

          {/* Quick Controls: Toggle Walk / Minimize */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsWalking((prev) => !prev);
                setSpeechBubble(!isWalking ? "Tớ đang bước đi nè! 🚶‍♂️" : "Tớ đứng lại trò chuyện nhé! 😊");
                setShowSpeech(true);
              }}
              className="p-1.5 rounded-full bg-white/85 hover:bg-white text-stone-600 shadow-sm border border-stone-200/60 transition-all text-[11px] font-bold cursor-pointer"
              title={isWalking ? "Dừng lại" : "Bước đi"}
            >
              {isWalking ? "⏸" : "🚶"}
            </button>
            {onToggleMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMode();
                }}
                className="p-1.5 rounded-full bg-white/85 hover:bg-white text-stone-600 shadow-sm border border-stone-200/60 transition-all text-[11px] font-bold cursor-pointer"
                title="Thu nhỏ thành nút tròn"
              >
                <Minimize2 className="w-3.5 h-3.5 text-stone-500" />
              </button>
            )}
          </div>

          {/* Online green dot */}
          <span className="absolute bottom-2 right-3 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default WalkingBot3D;
