import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, X } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

// ─── Interactive 3D Crystal Rose with Glowing Petals ─────────────────────────
function InteractiveCrystalRose({ onClick, opened }: { onClick: () => void; opened: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const isHovered = useRef(false);

  // Generate 4200 particles shaped into blooming 3D Rose Petals
  const roseParticles = useMemo(() => {
    const count = 4200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorRuby = new THREE.Color("#E11D48"); // Ruby rose
    const colorPink = new THREE.Color("#FDA4AF"); // Soft crystal pink
    const colorWhite = new THREE.Color("#FFF1F2"); // Prism white

    for (let i = 0; i < count; i++) {
      // Golden spiral multi-tier rose petal formula
      const theta = Math.random() * Math.PI * 14.0;
      const r = Math.pow(Math.random(), 0.65) * 2.3;
      const petalWave = Math.sin(theta * 3.5) * 0.35;

      const x = Math.cos(theta) * (r + petalWave * 0.4);
      const z = Math.sin(theta) * (r + petalWave * 0.4);
      // Bowl curvature shape for the rose bloom
      const y = (Math.pow(r, 1.8) * 0.55 - 0.7) + (Math.random() - 0.5) * 0.15;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color mapping: deeper ruby at center, soft pink towards outer petals
      const outerRatio = r / 2.3;
      const c = outerRatio < 0.4 ? colorRuby : outerRatio < 0.85 ? colorPink : colorWhite;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // Emerald crystal stem and leaves
  const stemParticles = useMemo(() => {
    const count = 900;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorEmerald = new THREE.Color("#10B981");
    const colorMint = new THREE.Color("#6EE7B7");

    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const y = -0.7 - t * 2.5;
      const x = Math.sin(t * 4.0) * 0.15 + (Math.random() - 0.5) * 0.08;
      const z = (Math.random() - 0.5) * 0.08;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const c = Math.random() < 0.7 ? colorEmerald : colorMint;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const hoverFactor = isHovered.current ? 1.6 : 1.0;
      groupRef.current.rotation.y += delta * 0.28 * hoverFactor;
      groupRef.current.rotation.x = 0.25 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        isHovered.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        isHovered.current = false;
        document.body.style.cursor = "auto";
      }}
    >
      {/* Rose Petals */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[roseParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[roseParticles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Stem & Leaves */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stemParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[stemParticles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glowing Inner Core */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.4, 20, 20]} />
        <meshBasicMaterial color="#FDA4AF" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ─── Floating Crystal Rose Petals ─────────────────────────────────────────────
function FloatingPetals() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 35;

  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 14,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      speedY: 0.3 + Math.random() * 0.4,
      rotSpeed: 0.5 + Math.random() * 1.0,
      scale: 0.15 + Math.random() * 0.15,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    petals.forEach((petal, i) => {
      petal.y -= petal.speedY * delta;
      petal.rotX += petal.rotSpeed * delta;
      petal.rotZ += petal.rotSpeed * delta * 0.7;

      if (petal.y < -6) {
        petal.y = 6;
        petal.x = (Math.random() - 0.5) * 14;
        petal.z = (Math.random() - 0.5) * 14;
      }

      dummy.position.set(petal.x, petal.y, petal.z);
      dummy.rotation.set(petal.rotX, petal.rotY, petal.rotZ);
      dummy.scale.set(petal.scale, petal.scale * 1.4, petal.scale * 0.3);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#FB7185" transparent opacity={0.75} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

// ─── Orbiting Memory Photo Card in Rose Crystal ──────────────────────────────
function OrbitingRosePhoto({
  url,
  index,
  total,
  radius = 5.0,
}: {
  url: string;
  index: number;
  total: number;
  radius?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) return;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [url]);

  const baseAngle = (index / total) * Math.PI * 2;

  useFrame((state) => {
    if (!meshRef.current) return;
    const angle = baseAngle + state.clock.elapsedTime * 0.18;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 3 + index) * 0.4;

    meshRef.current.position.set(x, y, z);
    meshRef.current.lookAt(0, 0, 0);
    meshRef.current.rotateY(Math.PI);
  });

  return (
    <group ref={meshRef}>
      {/* Rose Gold Frame */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.25, 1.25]} />
        <meshBasicMaterial color="#E11D48" />
      </mesh>
      {/* Inner Photo */}
      <mesh>
        <planeGeometry args={[1.18, 1.18]} />
        {texture ? (
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        ) : (
          <meshBasicMaterial color="#3F001E" />
        )}
      </mesh>
    </group>
  );
}

// ─── Crystal Rose 3D Scene ───────────────────────────────────────────────────
function CrystalRoseScene({
  gift,
  opened,
  onOpen,
}: {
  gift: any;
  opened: boolean;
  onOpen: () => void;
}) {
  const photos: string[] = (gift.photos || []).filter(Boolean);

  return (
    <>
      <color attach="background" args={["#140014"]} />
      <ambientLight intensity={0.9} />
      <pointLight position={[0, 2, 0]} intensity={3.5} color="#FDA4AF" distance={18} />
      <pointLight position={[5, -5, 5]} intensity={1.5} color="#E11D48" />

      <Stars radius={60} depth={50} count={2500} factor={3.5} saturation={0.8} fade speed={1.0} />
      <FloatingPetals />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
        <InteractiveCrystalRose onClick={onOpen} opened={opened} />
      </Float>

      {photos.map((url, i) => (
        <OrbitingRosePhoto key={i} url={url} index={i} total={photos.length} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 2.5}
        rotateSpeed={0.5}
      />
    </>
  );
}

// ─── Message Overlay ─────────────────────────────────────────────────────────
function RoseMessageOverlay({
  gift,
  onClose,
}: {
  gift: any;
  onClose: () => void;
}) {
  const themeStyle = {
    textMain: "text-rose-100",
    textSub: "text-rose-200/80",
    cardBg: "bg-rose-950/80",
    accentText: "text-rose-400",
    accentBg: "bg-rose-500",
    borderColor: "border-rose-500/30",
    glowColor: "rgba(225, 29, 72, 0.25)",
    heartColor: "#E11D48",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 220 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl bg-gradient-to-b from-[#25001C] via-[#1A0014] to-[#12000E] border border-rose-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6"
        style={{
          boxShadow: "0 0 60px rgba(225, 29, 72, 0.25), inset 0 0 20px rgba(225, 29, 72, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-300 hover:bg-rose-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          Bông Hồng Pha Lê 3D
        </div>

        {/* Recipient */}
        {gift.recipientName && (
          <h2 className="text-2xl sm:text-3xl font-black text-rose-200 tracking-tight font-serif">
            Gửi {gift.recipientName} 🌹
          </h2>
        )}

        {/* Title */}
        {gift.title && (
          <p className="text-lg font-bold text-rose-300 tracking-wide">
            {gift.title}
          </p>
        )}

        {/* Main Letter Body */}
        <div className="bg-black/50 border border-rose-500/20 rounded-2xl p-5 leading-relaxed text-sm text-rose-100 whitespace-pre-line font-medium shadow-inner">
          {gift.message || "Như bông hồng pha lê không bao giờ tàn phai, tình cảm này sẽ luôn vẹn nguyên và lấp lánh theo năm tháng..."}
        </div>

        {/* Audio / Video widgets */}
        {gift.hasVoice && gift.voiceUrl && (
          <AudioPlayerWidget src={gift.voiceUrl} themeStyle={themeStyle} />
        )}
        {gift.hasVideo && gift.videoUrl && (
          <VideoPlayerWidget src={gift.videoUrl} themeStyle={themeStyle} />
        )}

        {/* Sender Footer */}
        {gift.senderName && (
          <div className="text-right pt-2 border-t border-rose-500/20">
            <span className="text-xs text-rose-400/80 font-bold">Thương gửi từ: {gift.senderName} ❤️</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Click Hint ──────────────────────────────────────────────────────────────
function RoseClickHint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 pointer-events-none"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center"
      >
        <Sparkles className="w-5 h-5 text-rose-400 fill-rose-400" />
      </motion.div>
      <p className="text-rose-200/60 text-xs tracking-wider">Chạm vào đóa hồng để mở thiệp</p>
    </motion.div>
  );
}

// ─── Main Component Export ───────────────────────────────────────────────────
export function CrystalRoseCanvas3D({ gift }: { gift: any }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#140014]">
      <Canvas
        camera={{ position: [0, 1, 12], fov: 55 }}
        gl={{ antialias: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <CrystalRoseScene gift={gift} opened={opened} onOpen={() => setOpened(true)} />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {!opened && <RoseClickHint key="hint" />}
          {opened && (
            <RoseMessageOverlay
              key="message"
              gift={gift}
              onClose={() => setOpened(false)}
            />
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 bg-black/40 border border-rose-500/30 rounded-full px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="text-rose-200/80 text-xs tracking-widest uppercase font-bold">Mẫu Bông Hồng Pha Lê 3D</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
