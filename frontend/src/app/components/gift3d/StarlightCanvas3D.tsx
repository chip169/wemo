import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sparkles, Star, X } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

// ─── Interactive 3D Crescent Moon & Star Cluster ─────────────────────────────
function InteractiveMoon({ onClick, opened }: { onClick: () => void; opened: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const moonParticlesRef = useRef<THREE.Points>(null);
  const isHovered = useRef(false);

  // Generate 3600 particles shaped into a 3D Crescent Moon
  const moonParticles = useMemo(() => {
    const count = 3800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorGold = new THREE.Color("#F59E0B");
    const colorLightGold = new THREE.Color("#FDE68A");
    const colorWhite = new THREE.Color("#FFFFFF");

    let idx = 0;
    while (idx < count) {
      // Rejection sampling for crescent moon shape: outer circle minus inner circle
      const angle = (Math.random() - 0.5) * Math.PI * 1.5; // crescent arc
      const outerR = 2.1 + (Math.random() - 0.5) * 0.3;
      const x = Math.cos(angle) * outerR;
      const y = Math.sin(angle) * outerR;

      // Inner cut-out circle shifted to the right
      const cutX = x - 0.9;
      const cutY = y;
      const distFromCut = Math.sqrt(cutX * cutX + cutY * cutY);

      if (distFromCut > 1.6) {
        const z = (Math.random() - 0.5) * 0.45;
        pos[idx * 3] = x;
        pos[idx * 3 + 1] = y;
        pos[idx * 3 + 2] = z;

        const rand = Math.random();
        const c = rand < 0.6 ? colorGold : rand < 0.85 ? colorLightGold : colorWhite;
        col[idx * 3] = c.r;
        col[idx * 3 + 1] = c.g;
        col[idx * 3 + 2] = c.b;
        idx++;
      }
    }
    return { positions: pos, colors: col };
  }, []);

  // Golden star dust ring
  const stardustRing = useMemo(() => {
    const count = 2800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorGold = new THREE.Color("#FBBF24");
    const colorBlue = new THREE.Color("#60A5FA");

    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      const c = Math.random() < 0.75 ? colorGold : colorBlue;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const hoverFactor = isHovered.current ? 1.8 : 1.0;
      groupRef.current.rotation.y += delta * 0.25 * hoverFactor;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
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
      {/* Crescent Moon Particles */}
      <points ref={moonParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[moonParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[moonParticles.colors, 3]}
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

      {/* Orbiting Stardust Ring */}
      <points rotation={[0.4, 0.2, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stardustRing.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[stardustRing.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Central Glowing Star Core */}
      <mesh>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshBasicMaterial color="#FEF08A" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ─── Golden Shooting Stars ───────────────────────────────────────────────────
function GoldenShootingStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 12;

  const stars = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: 15 + Math.random() * 15,
      z: (Math.random() - 0.5) * 20,
      speed: 16 + Math.random() * 10,
      length: 1.5 + Math.random() * 2,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    stars.forEach((star, i) => {
      star.x -= star.speed * delta * 0.9;
      star.y -= star.speed * delta * 0.7;

      if (star.y < -15 || star.x < -25) {
        star.x = 20 + Math.random() * 15;
        star.y = 15 + Math.random() * 10;
        star.z = (Math.random() - 0.5) * 20;
      }

      dummy.position.set(star.x, star.y, star.z);
      dummy.scale.set(0.08, star.length, 0.08);
      dummy.rotation.z = Math.PI / 4;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.04, 0, 1.5, 6]} />
      <meshBasicMaterial color="#FDE68A" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

// ─── Orbiting Memory Photo Card in Starlight ─────────────────────────────────
function OrbitingPhoto({
  url,
  index,
  total,
  radius = 5.2,
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
    const angle = baseAngle + state.clock.elapsedTime * 0.16;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 2 + index) * 0.45;

    meshRef.current.position.set(x, y, z);
    meshRef.current.lookAt(0, 0, 0);
    meshRef.current.rotateY(Math.PI);
  });

  return (
    <group ref={meshRef}>
      {/* Golden Frame Border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.25, 1.25]} />
        <meshBasicMaterial color="#D97706" />
      </mesh>
      {/* Inner Photo */}
      <mesh>
        <planeGeometry args={[1.18, 1.18]} />
        {texture ? (
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        ) : (
          <meshBasicMaterial color="#1E293B" />
        )}
      </mesh>
    </group>
  );
}

// ─── Starlight 3D Scene ──────────────────────────────────────────────────────
function StarlightScene({
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
      <color attach="background" args={["#0B1021"]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 0]} intensity={3.0} color="#FDE68A" distance={20} />
      <pointLight position={[6, 8, 8]} intensity={1.5} color="#38BDF8" />

      <Stars radius={70} depth={60} count={3500} factor={4} saturation={0.5} fade speed={1.2} />
      <GoldenShootingStars />

      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
        <InteractiveMoon onClick={onOpen} opened={opened} />
      </Float>

      {photos.map((url, i) => (
        <OrbitingPhoto key={i} url={url} index={i} total={photos.length} />
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

// ─── Modal / Letter Overlay ──────────────────────────────────────────────────
function StarlightMessageOverlay({
  gift,
  onClose,
}: {
  gift: any;
  onClose: () => void;
}) {
  const themeStyle = {
    textMain: "text-amber-100",
    textSub: "text-amber-200/80",
    cardBg: "bg-slate-900/80",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.25)",
    heartColor: "#F59E0B",
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
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl bg-gradient-to-b from-slate-900 via-[#0F172A] to-slate-950 border border-amber-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6"
        style={{
          boxShadow: "0 0 60px rgba(245, 158, 11, 0.25), inset 0 0 20px rgba(245, 158, 11, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/80 border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
          <Moon className="w-4 h-4 fill-amber-400" />
          Dạ Khúc Ánh Sao 3D
        </div>

        {/* Recipient */}
        {gift.recipientName && (
          <h2 className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight font-serif">
            Gửi {gift.recipientName} ✨
          </h2>
        )}

        {/* Title */}
        {gift.title && (
          <p className="text-lg font-bold text-amber-400/90 tracking-wide">
            {gift.title}
          </p>
        )}

        {/* Main Letter Body */}
        <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-5 leading-relaxed text-sm text-stone-200 whitespace-pre-line font-medium shadow-inner">
          {gift.message || "Tình yêu và những ký ức đẹp nhất luôn lung linh tỏa sáng như ngàn vì sao giữa dải ngân hà..."}
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
          <div className="text-right pt-2 border-t border-amber-500/20">
            <span className="text-xs text-amber-400/80 font-bold">Thương mến từ: {gift.senderName} 🌙</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Click Hint Button ────────────────────────────────────────────────────────
function StarlightClickHint() {
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
        className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center"
      >
        <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
      </motion.div>
      <p className="text-amber-200/60 text-xs tracking-wider">Chạm vào vầng trăng để mở thiệp</p>
    </motion.div>
  );
}

// ─── Main Component Export ───────────────────────────────────────────────────
export function StarlightCanvas3D({ gift }: { gift: any }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0B1021]">
      <Canvas
        camera={{ position: [0, 1, 12], fov: 55 }}
        gl={{ antialias: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <StarlightScene gift={gift} opened={opened} onOpen={() => setOpened(true)} />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {!opened && <StarlightClickHint key="hint" />}
          {opened && (
            <StarlightMessageOverlay
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
            className="flex items-center gap-2 bg-slate-900/60 border border-amber-500/30 rounded-full px-4 py-1.5 backdrop-blur-sm"
          >
            <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-200/80 text-xs tracking-widest uppercase font-bold">Mẫu Dạ Khúc Ánh Sao 3D</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
