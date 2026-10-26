import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Play, Sparkles, Hand, Music, Smile, X, MessageSquare, ChevronRight, Minimize2 } from "lucide-react";

// Available animation names in wemo-robot.glb
export type RobotAnimation =
  | "Idle"
  | "Walking"
  | "Running"
  | "Wave"
  | "Dance"
  | "ThumbsUp"
  | "Jump"
  | "Yes"
  | "No";

interface RobotModelProps {
  currentAction: RobotAnimation;
  isPatrolling: boolean;
  onReachEdge?: () => void;
  speed?: number;
}

function RobotModel({ currentAction, isPatrolling, speed = 1.0 }: RobotModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/wemo-robot.glb");
  const { actions, mixer } = useAnimations(animations, group);

  // Position and direction state for autonomous patrol walking
  const posX = useRef(0);
  const direction = useRef(1); // 1 = moving right, -1 = moving left
  const targetRotationY = useRef(Math.PI / 2);

  // Switch animation clip with smooth crossfade
  useEffect(() => {
    if (!actions) return;

    const actionToPlay = actions[currentAction] || actions["Idle"];
    if (!actionToPlay) return;

    actionToPlay.reset().fadeIn(0.28).play();

    // If one-shot action (Wave, Jump, ThumbsUp), set clamp
    if (["Wave", "ThumbsUp", "Jump", "Dance"].includes(currentAction)) {
      actionToPlay.setLoop(THREE.LoopRepeat, currentAction === "Dance" ? 4 : 2);
    } else {
      actionToPlay.setLoop(THREE.LoopRepeat, Infinity);
    }

    return () => {
      actionToPlay.fadeOut(0.28);
    };
  }, [currentAction, actions]);

  // Patrol walking loop
  useFrame((_, delta) => {
    if (!group.current) return;

    if (isPatrolling && (currentAction === "Walking" || currentAction === "Running")) {
      const moveSpeed = (currentAction === "Running" ? 2.2 : 1.2) * speed * delta;
      posX.current += direction.current * moveSpeed;

      // Bound between -1.8 and 1.8 in 3D space
      const limit = 1.6;
      if (posX.current > limit) {
        posX.current = limit;
        direction.current = -1;
        targetRotationY.current = -Math.PI / 2;
      } else if (posX.current < -limit) {
        posX.current = -limit;
        direction.current = 1;
        targetRotationY.current = Math.PI / 2;
      }

      group.current.position.x = posX.current;
      // Smooth turn interpolation
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY.current,
        delta * 8
      );
    } else {
      // Return to facing front when idle or performing static gestures
      const frontTarget = currentAction === "Wave" ? -0.15 : 0;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        frontTarget,
        delta * 6
      );
    }
  });

  // Customize materials to match WEMO's warm palette
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.25;
          mat.metalness = 0.15;
        }
      }
    });
  }, [scene]);

  return (
    <group ref={group} position={[0, -1.2, 0]} scale={[0.9, 0.9, 0.9]}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Main Interactive Walking Bot Overlay Component ─────────────────────────
export interface WalkingBot3DProps {
  onOpenChat?: () => void;
  onToggleMode?: () => void;
  className?: string;
}

export function WalkingBot3D({ onOpenChat, onToggleMode, className = "" }: WalkingBot3DProps) {
  const [action, setAction] = useState<RobotAnimation>("Idle");
  const [isPatrolling, setIsPatrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string>("Chào bạn! Tớ là trợ lý WEMO 🧱");
  const [showSpeech, setShowSpeech] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Auto hide greeting bubble after 6 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowSpeech(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Handle Action Change
  const triggerAction = (act: RobotAnimation, speech?: string) => {
    setAction(act);
    if (act === "Walking" || act === "Running") {
      setIsPatrolling(true);
    } else {
      setIsPatrolling(false);
    }
    if (speech) {
      setSpeechBubble(speech);
      setShowSpeech(true);
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (!isPatrolling) {
      setAction("Wave");
      setSpeechBubble("Bạn cần WEMO hỗ trợ gì không ạ? 👋");
      setShowSpeech(true);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (!isPatrolling) {
      setAction("Idle");
    }
  };

  const handleClick = () => {
    triggerAction("Jump", "Tuyệt vời! Mở khung chat ngay nhé! ✨");
    setTimeout(() => {
      if (onOpenChat) onOpenChat();
    }, 600);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col items-end select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* ─── Speech Bubble ─── */}
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
                <Sparkles className="w-3 h-3 text-[#E8B4A8]" /> WEMO 3D Bot
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
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 right-12 w-3 h-3 bg-white rotate-45 border-r border-b border-[#E8B4A8]/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Action Toolbar Pill (Appears on click or hover) ─── */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="mb-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-2xl flex items-center gap-1"
          >
            {[
              { id: "Walking" as RobotAnimation, label: "Đi bộ", icon: "🚶" },
              { id: "Wave" as RobotAnimation, label: "Chào", icon: "👋" },
              { id: "Dance" as RobotAnimation, label: "Nhảy", icon: "💃" },
              { id: "ThumbsUp" as RobotAnimation, label: "Like", icon: "👍" },
              { id: "Idle" as RobotAnimation, label: "Đứng yên", icon: "⏸" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  if (btn.id === "Walking") {
                    triggerAction("Walking", "Tớ đang đi tuần tra đây! 🚶‍♂️");
                  } else if (btn.id === "Dance") {
                    triggerAction("Dance", "Nhảy múa cùng WEMO nào! 💃");
                  } else if (btn.id === "Wave") {
                    triggerAction("Wave", "Xin chào quý khách! 👋");
                  } else if (btn.id === "ThumbsUp") {
                    triggerAction("ThumbsUp", "WEMO số một luôn ạ! 👍");
                  } else {
                    triggerAction("Idle", "Tớ đứng nghỉ một tí nhé! 😌");
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  action === btn.id
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

      {/* ─── 3D Character Stage & Interactive Canvas ─── */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {/* 3D Canvas Viewport */}
        <div
          className="relative rounded-3xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
          style={{
            width: isPatrolling ? 260 : 160,
            height: 190,
            background: "radial-gradient(circle at 50% 65%, rgba(232,180,168,0.2) 0%, transparent 70%)",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 0.4, 4.4], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={1.1} />
            {/* Key light for glossy plastic reflections */}
            <directionalLight position={[3, 5, 4]} intensity={1.8} castShadow shadow-mapSize={512} />
            <directionalLight position={[-3, 3, 2]} intensity={0.8} color="#FFE6D5" />
            <directionalLight position={[0, 4, -4]} intensity={1.2} color="#FFDFBA" />

            <Suspense fallback={null}>
              <RobotModel currentAction={action} isPatrolling={isPatrolling} speed={1.0} />
            </Suspense>

            {/* Ground Contact Shadow */}
            <ContactShadows position={[0, -1.2, 0]} opacity={0.65} scale={isPatrolling ? 5 : 2.8} blur={1.5} far={3} />
          </Canvas>

          {/* Quick Menu & Mode Controls */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="p-1.5 rounded-full bg-white/85 hover:bg-white text-stone-600 shadow-sm border border-stone-200/60 transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              title="Menu động thái 3D (Đi bộ, Nhảy, Vẫy tay...)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF78]" />
            </button>
            {onToggleMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMode();
                }}
                className="p-1.5 rounded-full bg-white/85 hover:bg-white text-stone-600 shadow-sm border border-stone-200/60 transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
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

// Preload the 3D model
useGLTF.preload("/models/wemo-robot.glb");

export default WalkingBot3D;
