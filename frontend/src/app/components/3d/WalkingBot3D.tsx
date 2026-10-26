import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles as SparklesIcon, X } from "lucide-react";

// ─── Color Palette (Authentic ABS Glossy Plastic) ───────────────────────────
const LEGO_COLORS = {
  bearBrown: "#C27E3B",       // Warm Golden Caramel
  bearDarkBrown: "#7E4316",   // Rich chocolate accents
  creamBelly: "#FCECD2",      // Creamy chest & muzzle
  pinkHeart: "#FF6584",       // Translucent candy heart
  shirtWhite: "#FFFFFF",      // Clean white tee
  eyeBlack: "#18100C",        // Glossy black pupil
  eyeIris: "#5A3010",         // Warm amber iris
  cheeks: "#FF8A7A",          // Soft rosy blush
  studGold: "#E5A93C",        // Accent studs
};

// ─── Smooth LEGO Stud ───────────────────────────────────────────────────────
function LegoStud({ position, scale = [1, 1, 1], color = LEGO_COLORS.bearBrown }: {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.14, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}

// ─── Translucent Glowing Candy Heart ────────────────────────────────────────
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
      depth: 0.26,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
  }, [heartShape]);

  return (
    <group position={position} scale={[0.42, 0.42, 0.42]}>
      <mesh geometry={geom} castShadow>
        <meshPhysicalMaterial
          color={LEGO_COLORS.pinkHeart}
          emissive={LEGO_COLORS.pinkHeart}
          emissiveIntensity={0.65}
          roughness={0.08}
          transmission={0.85}
          thickness={0.8}
          clearcoat={1.0}
        />
      </mesh>
      <LegoStud position={[-0.32, 0.58, 0.13]} color={LEGO_COLORS.pinkHeart} scale={[0.55, 0.55, 0.55]} />
      <LegoStud position={[0.32, 0.58, 0.13]} color={LEGO_COLORS.pinkHeart} scale={[0.55, 0.55, 0.55]} />
    </group>
  );
}

// ─── Completely Seamless & Organic Chibi LEGO Mascot Figure ─────────────────
function SeamlessLegoFigure({
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

    // 1. Smooth Head Tracking (Eyes & head softly follow mouse)
    if (headRef.current) {
      const targetRotY = mouse.x * 0.42;
      const targetRotX = -mouse.y * 0.25;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
    }

    // 2. Continuous Organic Body Motion
    if (figureGroupRef.current) {
      if (motionMode === "dance") {
        figureGroupRef.current.position.y = -0.45 + Math.sin(t * 8) * 0.07;
        figureGroupRef.current.rotation.y = Math.sin(t * 4) * 0.2;
      } else if (motionMode === "walk") {
        figureGroupRef.current.position.y = -0.45 + Math.abs(Math.sin(t * 5)) * 0.045;
        figureGroupRef.current.rotation.y = Math.sin(t * 2.5) * 0.06;
      } else {
        // Natural gentle breathing float
        figureGroupRef.current.position.y = -0.45 + Math.sin(t * 2) * 0.03;
        figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, 0, 0.08);
      }
    }

    // 3. Right Arm (Waving) — seamless ball-joint rotation
    if (rightArmRef.current) {
      if (motionMode === "dance") {
        rightArmRef.current.rotation.z = -0.5 + Math.sin(t * 8) * 0.38;
        rightArmRef.current.rotation.x = 0.25 + Math.cos(t * 8) * 0.22;
      } else if (motionMode === "walk") {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.1);
        rightArmRef.current.rotation.x = Math.sin(t * 5) * 0.38;
      } else {
        const waveSpeed = isHovered ? 6.5 : 3.2;
        const waveAmp = isHovered ? 0.35 : 0.22;
        const wave = Math.sin(t * waveSpeed) * waveAmp;
        rightArmRef.current.rotation.z = -0.42 + wave;
        rightArmRef.current.rotation.x = 0.15 + Math.cos(t * 2.5) * 0.06;
      }
    }

    // 4. Left Arm (Holding heart)
    if (leftArmRef.current) {
      if (motionMode === "dance") {
        leftArmRef.current.rotation.x = 0.12 - Math.cos(t * 8) * 0.2;
      } else if (motionMode === "walk") {
        leftArmRef.current.rotation.x = 0.12 - Math.sin(t * 5) * 0.28;
      } else {
        leftArmRef.current.rotation.x = 0.1 + Math.sin(t * 1.5) * 0.035;
      }
    }

    // 5. Seamless Capsule Legs
    if (leftLegRef.current && rightLegRef.current) {
      if (motionMode === "walk" || motionMode === "dance") {
        const legSpeed = motionMode === "dance" ? 8 : 5;
        const legAmp = motionMode === "dance" ? 0.32 : 0.38;
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
      {/* ── 1. Seamless Head (Continuous Rounded Chibi Sphere) ── */}
      <group ref={headRef} position={[0, 0.88, 0]}>
        {/* Main Head: Beautiful, solid rounded sphere with zero holes or gaps */}
        <mesh castShadow receiveShadow scale={[1.08, 0.98, 1.02]}>
          <sphereGeometry args={[0.82, 36, 32]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearBrown}
            roughness={0.16}
            clearcoat={0.92}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Center LEGO Stud on crown */}
        <LegoStud position={[0, 0.82, 0]} color={LEGO_COLORS.bearBrown} scale={[1.1, 0.85, 1.1]} />

        {/* ── Left Ear (Seamlessly blended sphere) ── */}
        <group position={[-0.72, 0.62, 0]} rotation={[0, 0, 0.35]}>
          <mesh castShadow>
            <sphereGeometry args={[0.32, 24, 24]} />
            <meshPhysicalMaterial
              color={LEGO_COLORS.bearBrown}
              roughness={0.18}
              clearcoat={0.9}
            />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <circleGeometry args={[0.18, 20]} />
            <meshBasicMaterial color={LEGO_COLORS.creamBelly} />
          </mesh>
          <LegoStud position={[0, 0.3, 0]} color={LEGO_COLORS.bearBrown} scale={[0.7, 0.7, 0.7]} />
        </group>

        {/* ── Right Ear (Seamlessly blended sphere) ── */}
        <group position={[0.72, 0.62, 0]} rotation={[0, 0, -0.35]}>
          <mesh castShadow>
            <sphereGeometry args={[0.32, 24, 24]} />
            <meshPhysicalMaterial
              color={LEGO_COLORS.bearBrown}
              roughness={0.18}
              clearcoat={0.9}
            />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <circleGeometry args={[0.18, 20]} />
            <meshBasicMaterial color={LEGO_COLORS.creamBelly} />
          </mesh>
          <LegoStud position={[0, 0.3, 0]} color={LEGO_COLORS.bearBrown} scale={[0.7, 0.7, 0.7]} />
        </group>

        {/* ── Soft Flattened Cream Snout & Smile ── */}
        <group position={[0, -0.1, 0.72]}>
          <mesh castShadow scale={[1.12, 0.85, 0.55]}>
            <sphereGeometry args={[0.38, 24, 24]} />
            <meshPhysicalMaterial
              color={LEGO_COLORS.creamBelly}
              roughness={0.22}
              clearcoat={0.75}
            />
          </mesh>
          {/* Chocolate Button Nose */}
          <mesh position={[0, 0.1, 0.24]} scale={[1.2, 0.85, 0.8]}>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshPhysicalMaterial
              color={LEGO_COLORS.bearDarkBrown}
              roughness={0.14}
              clearcoat={1.0}
            />
          </mesh>
          {/* Sweet Smiling Mouth */}
          <mesh position={[0, -0.06, 0.24]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.11, 0.022, 12, 24, Math.PI * 0.85]} />
            <meshBasicMaterial color={LEGO_COLORS.bearDarkBrown} />
          </mesh>
        </group>

        {/* ── Big Anime Eyes with Double Specular Sparkles ── */}
        {/* Left Eye */}
        <group position={[-0.32, 0.12, 0.76]} rotation={[-0.05, -0.12, 0]}>
          <mesh scale={[1, 1.25, 1]}><circleGeometry args={[0.17, 28]} /><meshBasicMaterial color={LEGO_COLORS.eyeBlack} /></mesh>
          <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}><circleGeometry args={[0.13, 24]} /><meshBasicMaterial color={LEGO_COLORS.eyeIris} /></mesh>
          <mesh position={[-0.05, 0.06, 0.005]}><circleGeometry args={[0.06, 16]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0.04, -0.04, 0.005]}><circleGeometry args={[0.03, 14]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.32, 0.12, 0.76]} rotation={[-0.05, 0.12, 0]}>
          <mesh scale={[1, 1.25, 1]}><circleGeometry args={[0.17, 28]} /><meshBasicMaterial color={LEGO_COLORS.eyeBlack} /></mesh>
          <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}><circleGeometry args={[0.13, 24]} /><meshBasicMaterial color={LEGO_COLORS.eyeIris} /></mesh>
          <mesh position={[-0.05, 0.06, 0.005]}><circleGeometry args={[0.06, 16]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0.04, -0.04, 0.005]}><circleGeometry args={[0.03, 14]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
        </group>

        {/* Rosy Cheeks */}
        <mesh position={[-0.48, -0.08, 0.66]} rotation={[-0.1, -0.35, 0]}>
          <circleGeometry args={[0.15, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.48, -0.08, 0.66]} rotation={[-0.1, 0.35, 0]}>
          <circleGeometry args={[0.15, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
        </mesh>
      </group>

      {/* ── 2. Seamless Body (Smooth Capsule Torso & WEMO Tee) ── */}
      <group position={[0, 0, 0]}>
        {/* Main Body Capsule: Smoothly joins head at top, legs at bottom */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.54, 0.58, 16, 32]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.shirtWhite}
            roughness={0.2}
            clearcoat={0.85}
          />
        </mesh>

        {/* Soft Cream Belly & WEMO Emblem */}
        <mesh position={[0, -0.06, 0.48]}>
          <circleGeometry args={[0.34, 28]} />
          <meshBasicMaterial color={LEGO_COLORS.creamBelly} transparent opacity={0.85} />
        </mesh>
        {/* WEMO Mini Badge */}
        <mesh position={[0, 0.18, 0.49]}>
          <planeGeometry args={[0.42, 0.14]} />
          <meshBasicMaterial color="#5C352E" />
        </mesh>
        <mesh position={[0, 0.18, 0.495]}>
          <planeGeometry args={[0.36, 0.09]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* ── 3. Seamless Left Arm (Holding glowing heart close to body) ── */}
      <group ref={leftArmRef} position={[-0.56, 0.22, 0]}>
        {/* Upper Arm Capsule: Smooth spherical ends blend seamlessly at shoulder & hand */}
        <mesh position={[0.1, -0.22, 0.12]} rotation={[-0.35, 0.2, -0.25]} castShadow>
          <capsuleGeometry args={[0.13, 0.42, 12, 20]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearBrown}
            roughness={0.18}
            clearcoat={0.88}
          />
        </mesh>
        {/* Shoulder sleeve cap */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
        </mesh>
        {/* Cute rounded paw/C-hand holding heart */}
        <mesh position={[0.16, -0.42, 0.22]} rotation={[0, 0, Math.PI / 4]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} />
        </mesh>
        {/* Glowing Heart Brick */}
        <GlowingHeartBrick position={[0.16, -0.32, 0.35]} />
      </group>

      {/* ── 4. Seamless Right Arm (Waving cheerfully) ── */}
      <group ref={rightArmRef} position={[0.56, 0.22, 0]}>
        {/* Shoulder sleeve cap */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
        </mesh>
        {/* Arm Capsule: Smooth rounded ends with zero harsh seams */}
        <mesh position={[0.15, 0.18, 0.06]} rotation={[-0.2, 0, -0.45]} castShadow>
          <capsuleGeometry args={[0.13, 0.48, 12, 20]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearBrown}
            roughness={0.18}
            clearcoat={0.88}
          />
        </mesh>
        {/* Cheerful Waving Hand Paw */}
        <mesh position={[0.28, 0.45, 0.08]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.9} />
        </mesh>
      </group>

      {/* ── 5. Seamless Legs (Continuous rounded capsules) ── */}
      <group position={[0, -0.48, 0]}>
        {/* Left Leg Capsule */}
        <group ref={leftLegRef} position={[-0.26, -0.16, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.18, 0.38, 12, 20]} />
            <meshPhysicalMaterial
              color={LEGO_COLORS.bearBrown}
              roughness={0.18}
              clearcoat={0.88}
            />
          </mesh>
          {/* Subtle Chocolate Shoe Accent at Bottom */}
          <mesh position={[0, -0.22, 0.04]} scale={[1.05, 0.6, 1.15]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>

        {/* Right Leg Capsule */}
        <group ref={rightLegRef} position={[0.26, -0.16, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.18, 0.38, 12, 20]} />
            <meshPhysicalMaterial
              color={LEGO_COLORS.bearBrown}
              roughness={0.18}
              clearcoat={0.88}
            />
          </mesh>
          {/* Subtle Chocolate Shoe Accent at Bottom */}
          <mesh position={[0, -0.22, 0.04]} scale={[1.05, 0.6, 1.15]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* ── 6. Soft Ground Display Pedestal ── */}
      <group position={[0, -1.18, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[1.35, 1.45, 0.16, 32]} />
          <meshPhysicalMaterial color="#3E2723" roughness={0.35} clearcoat={0.6} />
        </mesh>
        {[-0.6, 0, 0.6].map((x, i) =>
          [-0.45, 0.45].map((z, j) => (
            <LegoStud
              key={`${i}-${j}`}
              position={[x, 0.1, z]}
              color="#3E2723"
              scale={[0.5, 0.45, 0.5]}
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
            camera={{ position: [0, 0.18, 5.2], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.95} />
            {/* Studio Key Light */}
            <directionalLight position={[4, 7, 5]} intensity={1.9} castShadow />
            {/* Warm Fill Light */}
            <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#FFE6D5" />
            {/* Rim Backlight */}
            <directionalLight position={[0, 4, -5]} intensity={1.5} color="#FFDFBA" />
            {/* Soft pink bounce from heart brick */}
            <pointLight position={[-0.2, -0.3, 0.8]} intensity={1.2} color="#FF6584" distance={2.5} />

            {/* Ambient Sparkles */}
            <Sparkles count={20} scale={3.4} size={2.2} speed={0.5} color="#FFB3C6" opacity={0.7} />

            <Float speed={1.8} rotationIntensity={0.05} floatIntensity={0.1}>
              <SeamlessLegoFigure isHovered={isHovered} motionMode={motionMode} />
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
