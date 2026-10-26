import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles as SparklesIcon, X } from "lucide-react";

// ─── High-Tech Luxury Color Palette ─────────────────────────────────────────
const BOT_COLORS = {
  bodyWhite: "#FFFFFF",        // Pearl White Ceramic
  visorBlack: "#0F172A",       // Glossy Obsidian Visor
  ledCyan: "#38BDF8",          // Sky Blue LED
  ledPink: "#F472B6",          // Soft Pink LED
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
          emissiveIntensity={0.85}
          roughness={0.08}
          transmission={0.88}
          thickness={0.8}
          clearcoat={1.0}
        />
      </mesh>
      {/* Golden NFC Ring Accent */}
      <mesh position={[0, 0, 0.24]}>
        <ringGeometry args={[0.18, 0.24, 24]} />
        <meshBasicMaterial color={BOT_COLORS.roseGold} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Sleek Futuristic Chibi Bot (WEMO Astro-Bot) ────────────────────────────
function AstroBotFigure({
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

    // 1. Head and Visor Cursor Tracking
    if (headRef.current) {
      const targetRotY = mouse.x * 0.45;
      const targetRotX = -mouse.y * 0.28;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
    }

    // 2. Body Floating & Bobbing
    if (figureGroupRef.current) {
      if (motionMode === "dance") {
        figureGroupRef.current.position.y = -0.45 + Math.sin(t * 8) * 0.08;
        figureGroupRef.current.rotation.y = Math.sin(t * 4) * 0.22;
      } else if (motionMode === "walk") {
        figureGroupRef.current.position.y = -0.45 + Math.abs(Math.sin(t * 5)) * 0.05;
        figureGroupRef.current.rotation.y = Math.sin(t * 2.5) * 0.08;
      } else {
        // Futuristic gentle antigravity hover
        figureGroupRef.current.position.y = -0.45 + Math.sin(t * 2.2) * 0.04;
        figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, 0, 0.08);
      }
    }

    // 3. Right Arm (Waving)
    if (rightArmRef.current) {
      if (motionMode === "dance") {
        rightArmRef.current.rotation.z = -0.5 + Math.sin(t * 8) * 0.42;
        rightArmRef.current.rotation.x = 0.25 + Math.cos(t * 8) * 0.25;
      } else if (motionMode === "walk") {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.1);
        rightArmRef.current.rotation.x = Math.sin(t * 5) * 0.42;
      } else {
        const waveSpeed = isHovered ? 7.0 : 3.5;
        const waveAmp = isHovered ? 0.38 : 0.24;
        const wave = Math.sin(t * waveSpeed) * waveAmp;
        rightArmRef.current.rotation.z = -0.45 + wave;
        rightArmRef.current.rotation.x = 0.15 + Math.cos(t * 2.5) * 0.08;
      }
    }

    // 4. Left Arm (Holding NFC Heart)
    if (leftArmRef.current) {
      if (motionMode === "dance") {
        leftArmRef.current.rotation.x = 0.15 - Math.cos(t * 8) * 0.25;
      } else if (motionMode === "walk") {
        leftArmRef.current.rotation.x = 0.15 - Math.sin(t * 5) * 0.32;
      } else {
        leftArmRef.current.rotation.x = 0.1 + Math.sin(t * 1.5) * 0.04;
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
    <group ref={figureGroupRef} position={[0, -0.45, 0]}>
      {/* ── 1. Futuristic Chibi Robot Head ── */}
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
        {isHovered || motionMode === "dance" ? (
          // Happy squinting arches (^ ^)
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
        ) : (
          // Bright, cute digital oval eyes with cyan glow
          <>
            <group position={[-0.26, 0.04, 0.81]}>
              <mesh scale={[1, 1.35, 1]}>
                <circleGeometry args={[0.1, 24]} />
                <meshBasicMaterial color={BOT_COLORS.ledCyan} />
              </mesh>
              {/* White pupil sparkle */}
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
              {/* White pupil sparkle */}
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
          {/* Subtle dark bezel ring */}
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
        {/* Floating / Held NFC Heart */}
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
        {/* Cute Rounded Waving Hand */}
        <mesh position={[0.28, 0.44, 0.08]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
        </mesh>
      </group>

      {/* ── 5. Seamless Robotic Biped Legs ── */}
      <group position={[0, -0.48, 0]}>
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.26, -0.16, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.16, 0.36, 12, 20]} />
            <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
          </mesh>
          {/* Cyan Glowing Hover Foot Pad */}
          <mesh position={[0, -0.22, 0.04]} scale={[1.05, 0.55, 1.15]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshPhysicalMaterial
              color={BOT_COLORS.ledCyan}
              emissive={BOT_COLORS.ledCyan}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.26, -0.16, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.16, 0.36, 12, 20]} />
            <meshPhysicalMaterial color={BOT_COLORS.bodyWhite} roughness={0.15} clearcoat={1.0} />
          </mesh>
          {/* Cyan Glowing Hover Foot Pad */}
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
        {/* Glowing holographic ring */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.95, 32]} />
          <meshBasicMaterial color={BOT_COLORS.wemoCoral} side={THREE.DoubleSide} />
        </mesh>
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
  const [speechBubble, setSpeechBubble] = useState("Chào bạn! Tớ là trợ lý WEMO Bot 🤖✨");

  const handlePointerEnter = () => {
    setIsHovered(true);
    setSpeechBubble("Chào bạn! Bạn cần WEMO hỗ trợ điều gì ạ? 👋");
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
                <SparklesIcon className="w-3 h-3 text-[#E8B4A8]" /> WEMO Bot 🤖
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
            camera={{ position: [0, 0.18, 5.2], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.9} />
            {/* Studio Key Light */}
            <directionalLight position={[4, 7, 5]} intensity={2.0} castShadow />
            {/* Warm Fill Light */}
            <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#FFE6D5" />
            {/* Rim Backlight */}
            <directionalLight position={[0, 4, -5]} intensity={1.5} color="#FFDFBA" />
            {/* Pink LED bounce from heart core */}
            <pointLight position={[-0.2, -0.3, 0.8]} intensity={1.3} color="#FF4D6D" distance={2.5} />

            {/* Ambient Sparkles */}
            <Sparkles count={20} scale={3.4} size={2.2} speed={0.5} color="#FFB3C6" opacity={0.7} />

            <Float speed={1.8} rotationIntensity={0.05} floatIntensity={0.1}>
              <AstroBotFigure isHovered={isHovered} motionMode={motionMode} />
            </Float>

            {/* Ground Contact Shadow */}
            <ContactShadows position={[0, -1.8, 0]} opacity={0.45} scale={4.2} blur={1.8} far={3} />
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
