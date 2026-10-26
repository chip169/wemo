import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles as SparklesIcon, X, Minimize2 } from "lucide-react";

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

export type LegoAnimationState = "Idle" | "Walk" | "Wave" | "Dance" | "ThumbsUp";

// ─── Animation Track Generators for Bone Rigging ─────────────────────────────
function createQuatTrack(
  boneName: string,
  times: number[],
  anglesX: number[] = [],
  anglesY: number[] = [],
  anglesZ: number[] = []
) {
  const values: number[] = [];
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < times.length; i++) {
    const rx = anglesX[i] || 0;
    const ry = anglesY[i] || 0;
    const rz = anglesZ[i] || 0;
    e.set(rx, ry, rz);
    q.setFromEuler(e);
    values.push(q.x, q.y, q.z, q.w);
  }
  return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
}

// ─── Generate Mixamo-style Skeletal Animation Clips ──────────────────────────
function createLegoClips() {
  // 1. WALK CLIP (Smooth mechanical bipedal walk cycle)
  const walkTimes = [0, 0.2, 0.4, 0.6, 0.8];
  const walkClip = new THREE.AnimationClip("Walk", 0.8, [
    createQuatTrack("LeftUpLeg", walkTimes, [0, 0.6, 0, -0.6, 0]),
    createQuatTrack("RightUpLeg", walkTimes, [0, -0.6, 0, 0.6, 0]),
    createQuatTrack("LeftArm", walkTimes, [0, -0.45, 0, 0.45, 0]),
    createQuatTrack("RightArm", walkTimes, [0, 0.45, 0, -0.45, 0]),
    createQuatTrack("Spine", walkTimes, [], [0, 0.08, 0, -0.08, 0]),
    new THREE.VectorKeyframeTrack("Hips.position", walkTimes, [
      0, -0.45, 0,
      0, -0.38, 0,
      0, -0.45, 0,
      0, -0.38, 0,
      0, -0.45, 0,
    ]),
  ]);

  // 2. IDLE CLIP (Gentle rhythmic breathing & subtle sway)
  const idleTimes = [0, 1.2, 2.4];
  const idleClip = new THREE.AnimationClip("Idle", 2.4, [
    createQuatTrack("Spine", idleTimes, [0, 0.03, 0]),
    createQuatTrack("LeftArm", idleTimes, [0.1, 0.15, 0.1]),
    createQuatTrack("RightArm", idleTimes, [0.1, 0.15, 0.1]),
    new THREE.VectorKeyframeTrack("Hips.position", idleTimes, [
      0, -0.45, 0,
      0, -0.43, 0,
      0, -0.45, 0,
    ]),
  ]);

  // 3. WAVE CLIP (Cheerfully waving right C-hand)
  const waveTimes = [0, 0.25, 0.5, 0.75, 1.0];
  const waveClip = new THREE.AnimationClip("Wave", 1.0, [
    createQuatTrack("RightArm", waveTimes, [0.3, 0.4, 0.3, 0.4, 0.3], [], [-0.4, -0.85, -0.4, -0.85, -0.4]),
    createQuatTrack("Head", waveTimes, [], [], [0, -0.08, 0, -0.08, 0]),
    createQuatTrack("LeftArm", waveTimes, [0.15, 0.2, 0.15, 0.2, 0.15]),
    new THREE.VectorKeyframeTrack("Hips.position", waveTimes, [
      0, -0.45, 0,
      0, -0.44, 0,
      0, -0.45, 0,
      0, -0.44, 0,
      0, -0.45, 0,
    ]),
  ]);

  // 4. DANCE CLIP (Lively celebratory dance)
  const danceTimes = [0, 0.2, 0.4, 0.6, 0.8];
  const danceClip = new THREE.AnimationClip("Dance", 0.8, [
    createQuatTrack("Hips", danceTimes, [], [0, 0.25, 0, -0.25, 0]),
    createQuatTrack("LeftArm", danceTimes, [-0.3, 0.4, -0.3, 0.4, -0.3], [], [0.2, -0.2, 0.2, -0.2, 0.2]),
    createQuatTrack("RightArm", danceTimes, [0.4, -0.3, 0.4, -0.3, 0.4], [], [-0.2, 0.2, -0.2, 0.2, -0.2]),
    createQuatTrack("LeftUpLeg", danceTimes, [0, 0.3, 0, -0.3, 0]),
    createQuatTrack("RightUpLeg", danceTimes, [0, -0.3, 0, 0.3, 0]),
    new THREE.VectorKeyframeTrack("Hips.position", danceTimes, [
      0, -0.45, 0,
      0, -0.36, 0,
      0, -0.45, 0,
      0, -0.36, 0,
      0, -0.45, 0,
    ]),
  ]);

  // 5. THUMBS UP CLIP
  const thumbTimes = [0, 0.3, 0.8, 1.1];
  const thumbClip = new THREE.AnimationClip("ThumbsUp", 1.1, [
    createQuatTrack("RightArm", thumbTimes, [0.2, 0.85, 0.85, 0.2]),
    createQuatTrack("Head", thumbTimes, [0, 0.15, 0.15, 0]),
    new THREE.VectorKeyframeTrack("Hips.position", thumbTimes, [
      0, -0.45, 0,
      0, -0.43, 0,
      0, -0.43, 0,
      0, -0.45, 0,
    ]),
  ]);

  return {
    Idle: idleClip,
    Walk: walkClip,
    Wave: waveClip,
    Dance: danceClip,
    ThumbsUp: thumbClip,
  };
}

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
        <meshPhysicalMaterial color={LEGO_COLORS.pinkHeart} emissive={LEGO_COLORS.pinkHeart} emissiveIntensity={0.65} roughness={0.08} clearcoat={1.0} />
      </mesh>
    </group>
  );
}

// ─── Lego Head ──────────────────────────────────────────────────────────────
function LegoHead() {
  return (
    <group position={[0, 0, 0]}>
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

// ─── Complete Skeletal Rigged LEGO Minifigure Character ──────────────────────
function RiggedLegoFigure({ currentAnimation }: { currentAnimation: LegoAnimationState }) {
  const rootRef = useRef<THREE.Group>(null);
  const headBoneRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Create AnimationClips
  const clips = useMemo(() => createLegoClips(), []);

  // AnimationMixer instance bound to root
  const mixer = useMemo(() => {
    if (!rootRef.current) return null;
    return new THREE.AnimationMixer(rootRef.current);
  }, []);

  // Switch animation states with smooth crossfade
  useEffect(() => {
    if (!mixer) return;
    const clip = clips[currentAnimation] || clips.Idle;
    const action = mixer.clipAction(clip);
    action.reset().fadeIn(0.28).play();

    return () => {
      action.fadeOut(0.28);
    };
  }, [mixer, currentAnimation, clips]);

  // Update mixer and mouse head tracking in frame loop
  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);

    // Additive head tracking towards mouse
    if (headBoneRef.current) {
      const targetRotY = mouse.x * 0.4;
      const targetRotX = -mouse.y * 0.22;
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRotY, 0.08);
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRotX, 0.08);
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.1, 0]}>
      {/* ── Root & Hips Bone ── */}
      <group name="Hips" position={[0, -0.45, 0]}>
        {/* Hip Connector T-Bar */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[1.3, 0.24, 0.88]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 1.34, 24]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
        </mesh>

        {/* ── Left Leg Bone ── */}
        <group name="LeftUpLeg" position={[-0.38, 0, 0]}>
          <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.1, 0.82]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} />
          </mesh>
          <mesh position={[0, -0.98, 0.22]} castShadow>
            <boxGeometry args={[0.56, 0.22, 0.4]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>

        {/* ── Right Leg Bone ── */}
        <group name="RightUpLeg" position={[0.38, 0, 0]}>
          <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.1, 0.82]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} />
          </mesh>
          <mesh position={[0, -0.98, 0.22]} castShadow>
            <boxGeometry args={[0.56, 0.22, 0.4]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>

        {/* ── Spine & Torso Bone ── */}
        <group name="Spine" position={[0, 0.6, 0]}>
          <LegoTorso />

          {/* ── Head Bone ── */}
          <group ref={headBoneRef} name="Head" position={[0, 1.35, 0]}>
            <LegoHead />
          </group>

          {/* ── Left Arm Bone (Holding Heart) ── */}
          <group name="LeftArm" position={[-0.72, 0.55, 0]}>
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
            </mesh>
            <mesh position={[-0.15, -0.45, 0.22]} rotation={[0.45, 0, 0.2]}>
              <cylinderGeometry args={[0.16, 0.18, 0.75, 18]} />
              <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} />
            </mesh>
            <LegoHand position={[-0.24, -0.85, 0.42]} rotation={[-0.3, 0.4, 0.5]} />
            <GlowingHeartBrick position={[-0.24, -0.75, 0.65]} />
          </group>

          {/* ── Right Arm Bone (Waving/Gesturing) ── */}
          <group name="RightArm" position={[0.72, 0.55, 0]}>
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
            </mesh>
            <mesh position={[0.22, 0.25, 0.1]} rotation={[-0.3, 0, -0.55]}>
              <cylinderGeometry args={[0.16, 0.18, 0.75, 18]} />
              <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} />
            </mesh>
            <LegoHand position={[0.42, 0.62, 0.15]} rotation={[0.5, 0.4, -0.8]} />
          </group>
        </group>
      </group>
    </group>
  );
}

// ─── Main Interactive Walking & Gesturing Bot Overlay ────────────────────────
export interface WalkingBot3DProps {
  onOpenChat?: () => void;
  onToggleMode?: () => void;
  className?: string;
}

export function WalkingBot3D({ onOpenChat, onToggleMode, className = "" }: WalkingBot3DProps) {
  const [anim, setAnim] = useState<LegoAnimationState>("Walk");
  const [speechBubble, setSpeechBubble] = useState("Chào bạn! Tớ là gấu LEGO WEMO 🧱");
  const [showSpeech, setShowSpeech] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const handlePointerEnter = () => {
    setAnim("Wave");
    setSpeechBubble("Chào bạn! Bạn cần WEMO hỗ trợ gì ạ? 👋");
    setShowSpeech(true);
  };

  const handlePointerLeave = () => {
    setAnim("Walk");
  };

  const handleClick = () => {
    setAnim("Dance");
    setSpeechBubble("Mở khung chat hỗ trợ ngay nhé! ✨");
    setTimeout(() => {
      if (onOpenChat) onOpenChat();
    }, 600);
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeech(false);
                }}
                className="text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="leading-snug text-stone-700">{speechBubble}</p>
            <div className="absolute -bottom-1.5 right-12 w-3 h-3 bg-white rotate-45 border-r border-b border-[#E8B4A8]/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Action Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="mb-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-2xl flex items-center gap-1"
          >
            {[
              { id: "Walk" as LegoAnimationState, label: "Đi bộ", icon: "🚶" },
              { id: "Wave" as LegoAnimationState, label: "Chào", icon: "👋" },
              { id: "Dance" as LegoAnimationState, label: "Nhảy", icon: "💃" },
              { id: "ThumbsUp" as LegoAnimationState, label: "Like", icon: "👍" },
              { id: "Idle" as LegoAnimationState, label: "Nghỉ", icon: "😌" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setAnim(btn.id);
                  if (btn.id === "Walk") setSpeechBubble("Tớ sải bước đi dạo đây! 🚶‍♂️");
                  if (btn.id === "Dance") setSpeechBubble("Nhảy múa cùng WEMO nào! 💃");
                  if (btn.id === "Wave") setSpeechBubble("Xin chào quý khách! 👋");
                  if (btn.id === "ThumbsUp") setSpeechBubble("WEMO số 1 luôn nhé! 👍");
                  if (btn.id === "Idle") setSpeechBubble("Tớ đứng nghỉ một tí nha! 😌");
                  setShowSpeech(true);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  anim === btn.id
                    ? "bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span>{btn.icon}</span>
                <span className="text-[11px]">{btn.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Character Canvas */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <div
          className="relative transition-transform duration-300 group-hover:scale-105"
          style={{
            width: 195,
            height: 230,
            background: "transparent",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 0.1, 5.3], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={1.25} />
            <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow />
            <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#FFE6D5" />
            <directionalLight position={[0, 4, -4]} intensity={1.3} color="#FFDFBA" />
            <pointLight position={[-0.24, -0.6, 0.8]} intensity={1.4} color="#FF6584" distance={2.5} />

            <Sparkles count={24} scale={3.6} size={2.4} speed={0.5} color="#FFB3C6" opacity={0.7} />

            <RiggedLegoFigure currentAnimation={anim} />

            <ContactShadows position={[0, -1.75, 0]} opacity={0.65} scale={4} blur={1.8} far={3} />
          </Canvas>

          {/* Action Menu Pill Button */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md border border-stone-200/80 transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              title="Đổi động tác 3D (Đi bộ, Nhảy múa, Vẫy tay...)"
            >
              <SparklesIcon className="w-3.5 h-3.5 text-[#D4AF78]" />
            </button>
          </div>

          {/* Online status indicator */}
          <span className="absolute bottom-4 right-4 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default WalkingBot3D;
