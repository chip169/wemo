import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sparkles, Star, X } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

// ─── Interactive 3D Crescent Moon & Cosmic Nebula ─────────────────────────────
function InteractiveMoon({ onClick, opened }: { onClick: () => void; opened: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const polarisRef = useRef<THREE.Group>(null);
  const isHovered = useRef(false);

  // 1. Generate 7,500 particles shaped into a true volumetric 3D Crescent Moon
  const moonParticles = useMemo(() => {
    const count = 7500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorDeepGold = new THREE.Color("#D97706");
    const colorGold = new THREE.Color("#F59E0B");
    const colorBrightGold = new THREE.Color("#FBBF24");
    const colorChampagne = new THREE.Color("#FDE68A");
    const colorWhite = new THREE.Color("#FFFFFF");

    const R0 = 2.4;
    const Tmax = 1.35;
    const Z0 = 0.55;

    for (let i = 0; i < count; i++) {
      // Angle from bottom horn to top horn
      const u = (Math.random() - 0.5) * Math.PI * 0.94;
      const v = Math.random(); // 0 at inner edge, 1 at outer ridge
      const hornFactor = Math.pow(Math.cos(u), 0.75);
      const thick = Tmax * hornFactor;
      const r = R0 - (1 - v) * thick;

      // Center the crescent moon around origin
      const x = r * Math.cos(u) - 0.9;
      const y = r * Math.sin(u);

      // Volumetric 3D thickness with smooth elliptical cross section
      const zProfile = Math.sqrt(Math.max(0, 1 - Math.pow(2 * v - 1, 2)));
      const z = (Math.random() - 0.5) * 2 * Z0 * hornFactor * zProfile;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color distribution: deep gold at inner body, brilliant champagne & white at ridge/horns
      const isRidge = v > 0.78 || hornFactor < 0.25;
      let c = colorGold;
      if (isRidge) {
        c = Math.random() < 0.65 ? colorWhite : colorChampagne;
      } else if (v < 0.3) {
        c = colorDeepGold;
      } else {
        c = Math.random() < 0.5 ? colorBrightGold : colorChampagne;
      }

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // 2. 8-Pointed 3D Polaris Star resting inside the crescent cradle
  const polarisParticles = useMemo(() => {
    const count = 1400;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorCore = new THREE.Color("#FEF08A");
    const colorWhite = new THREE.Color("#FFFFFF");
    const colorCyan = new THREE.Color("#7DD3FC");

    for (let i = 0; i < count; i++) {
      const isRay = Math.random() < 0.72;
      let rx = 0, ry = 0, rz = 0;
      let c = colorCore;

      if (isRay) {
        const rayIdx = Math.floor(Math.random() * 8);
        const angle = (rayIdx * Math.PI) / 4;
        const maxLen = rayIdx % 2 === 0 ? 0.95 : 0.6;
        const len = Math.pow(Math.random(), 0.55) * maxLen;
        const taper = 1.0 - (len / maxLen);
        const perp = (Math.random() - 0.5) * 0.08 * taper;

        rx = Math.cos(angle) * len - Math.sin(angle) * perp;
        ry = Math.sin(angle) * len + Math.cos(angle) * perp;
        rz = (Math.random() - 0.5) * 0.09 * taper;

        c = len > 0.5 ? (Math.random() < 0.5 ? colorWhite : colorCyan) : colorCore;
      } else {
        const u = Math.random() * 2 * Math.PI;
        const v = Math.acos(2 * Math.random() - 1);
        const r = Math.random() * 0.24;
        rx = r * Math.sin(v) * Math.cos(u);
        ry = r * Math.sin(v) * Math.sin(u);
        rz = r * Math.cos(v);
        c = Math.random() < 0.7 ? colorCore : colorWhite;
      }

      pos[i * 3] = rx;
      pos[i * 3 + 1] = ry;
      pos[i * 3 + 2] = rz;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // 3. Cosmic Nebula Ribbon Swirling around the Crescent Moon
  const nebulaRibbon = useMemo(() => {
    const count = 4800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorCyan = new THREE.Color("#38BDF8");
    const colorIndigo = new THREE.Color("#818CF8");
    const colorPurple = new THREE.Color("#C084FC");
    const colorGold = new THREE.Color("#FDE047");
    const colorWhite = new THREE.Color("#FFFFFF");

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 4; // 2 loops
      const baseR = 2.9 + Math.sin(t * 1.5) * 0.85;
      const ribbonW = (Math.random() - 0.5) * 0.75;
      const ribbonH = (Math.random() - 0.5) * 0.45;

      const x = Math.cos(t) * (baseR + ribbonW);
      const z = Math.sin(t) * (baseR + ribbonW);
      const y = Math.sin(t * 0.8) * 1.6 + ribbonH;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const normT = (t / (Math.PI * 4));
      let c = colorCyan;
      if (normT < 0.25) c = Math.random() < 0.5 ? colorCyan : colorIndigo;
      else if (normT < 0.5) c = Math.random() < 0.5 ? colorIndigo : colorPurple;
      else if (normT < 0.75) c = Math.random() < 0.5 ? colorPurple : colorGold;
      else c = Math.random() < 0.6 ? colorGold : colorWhite;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const hoverFactor = isHovered.current ? 1.6 : 1.0;
      groupRef.current.rotation.y += delta * 0.22 * hoverFactor;
      groupRef.current.rotation.x = 0.18 + Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    }
    if (polarisRef.current) {
      polarisRef.current.rotation.z -= delta * 0.35;
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 3.2) * 0.12;
      polarisRef.current.scale.set(pulse, pulse, pulse);
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
      {/* Volumetric Crescent Moon */}
      <points>
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

      {/* 3D Radiant Polaris Star nestled in crescent */}
      <group ref={polarisRef} position={[-0.1, 0.2, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[polarisParticles.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[polarisParticles.colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.055}
            vertexColors
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* Cosmic Nebula Swirl Ribbon */}
      <points rotation={[0.3, 0.2, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nebulaRibbon.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[nebulaRibbon.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Warm Starlight Glow Light */}
      <pointLight position={[-0.1, 0.2, 0]} intensity={3.2} color="#FEF08A" distance={6} />

      {/* Invisible Interactive Hit Mesh */}
      <mesh visible={false} position={[0, 0, 0]}>
        <sphereGeometry args={[3.0, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

// ─── Golden Shooting Stars with Luminous Streaks ──────────────────────────────
function GoldenShootingStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 16;

  const stars = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 50,
      y: 12 + Math.random() * 20,
      z: (Math.random() - 0.5) * 30,
      speed: 18 + Math.random() * 12,
      length: 2.2 + Math.random() * 2.5,
      thickness: 0.05 + Math.random() * 0.04,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    stars.forEach((star, i) => {
      star.x -= star.speed * delta * 0.88;
      star.y -= star.speed * delta * 0.65;

      if (star.y < -18 || star.x < -30) {
        star.x = 25 + Math.random() * 20;
        star.y = 15 + Math.random() * 15;
        star.z = (Math.random() - 0.5) * 30;
      }

      dummy.position.set(star.x, star.y, star.z);
      dummy.scale.set(star.thickness, star.length, star.thickness);
      dummy.rotation.z = Math.PI / 4;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.03, 0.005, 1.8, 6]} />
      <meshBasicMaterial
        color="#FDE68A"
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

// ─── Ambient Floating Starlight Motes ─────────────────────────────────────────
function FloatingStarMotes() {
  const motesRef = useRef<THREE.Points>(null);
  const count = 75;

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    const gold = new THREE.Color("#FDE047");
    const cyan = new THREE.Color("#38BDF8");
    const white = new THREE.Color("#FFFFFF");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const c = Math.random() < 0.5 ? gold : Math.random() < 0.8 ? cyan : white;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      spd[i] = 0.3 + Math.random() * 0.5;
    }
    return { positions: pos, colors: col, speeds: spd };
  }, []);

  useFrame((state, delta) => {
    if (!motesRef.current) return;
    const posAttr = motesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += speeds[i] * delta * 0.4;
      posArr[i * 3] += Math.sin(state.clock.elapsedTime + i) * delta * 0.15;

      if (posArr[i * 3 + 1] > 7) {
        posArr[i * 3 + 1] = -7;
        posArr[i * 3] = (Math.random() - 0.5) * 16;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 14;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={motesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
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
        <planeGeometry args={[1.3, 1.3]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      {/* Corner Gem Stars */}
      {[[-0.6, 0.6], [0.6, 0.6], [-0.6, -0.6], [0.6, -0.6]].map(([cx, cy], ci) => (
        <mesh key={ci} position={[cx, cy, 0.005]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
      ))}
      {/* Inner Photo */}
      <mesh>
        <planeGeometry args={[1.18, 1.18]} />
        {texture ? (
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        ) : (
          <meshBasicMaterial color="#0F172A" />
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
      <color attach="background" args={["#080C1E"]} />
      <ambientLight intensity={0.9} />
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#FEF08A" distance={20} />
      <pointLight position={[6, 8, 8]} intensity={2.0} color="#38BDF8" />
      <pointLight position={[-6, -6, -4]} intensity={1.5} color="#C084FC" />

      <Stars radius={75} depth={60} count={4000} factor={4.5} saturation={0.6} fade speed={1.2} />
      <GoldenShootingStars />
      <FloatingStarMotes />

      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
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
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#080C1E]">
      <Canvas
        camera={{ position: [0, 0.4, 11], fov: 52 }}
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
