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
  const coreRef = useRef<THREE.Points>(null);
  const isHovered = useRef(false);

  // Generate 12,000+ particles shaped into a true multi-tiered blooming 3D Rose
  const roseParticles = useMemo(() => {
    const pts: { x: number; y: number; z: number; color: THREE.Color }[] = [];

    const colorBudDark = new THREE.Color("#881337");    // Deepest velvet crimson
    const colorBud = new THREE.Color("#9F1239");        // Velvety ruby
    const colorCrimson = new THREE.Color("#BE123C");    // Rich crimson
    const colorRose = new THREE.Color("#E11D48");       // Vivid rose red
    const colorHotPink = new THREE.Color("#F43F5E");    // Radiant glowing pink
    const colorPink = new THREE.Color("#FB7185");       // Crystal pink
    const colorSoftPink = new THREE.Color("#FDA4AF");   // Delicate blush
    const colorPrism = new THREE.Color("#FFF1F2");      // Diamond prism highlight
    const colorWhite = new THREE.Color("#FFFFFF");      // Pure sparkle

    // 1. Center bud spiral whorl (the tight heart of the rose)
    const budCount = 1800;
    for (let i = 0; i < budCount; i++) {
      const t = i / budCount;
      const theta = t * Math.PI * 18.0;
      // Exponential spiral: tight at bottom, gently unfurling at the top
      const r = 0.04 + Math.pow(t, 0.72) * 0.72;
      const y = 0.15 + t * 0.95 + (Math.random() - 0.5) * 0.04;
      const wave = Math.sin(theta * 2.0) * 0.04 * t;
      const x = Math.cos(theta) * (r + wave);
      const z = Math.sin(theta) * (r + wave);

      const col = t < 0.35 ? colorBudDark : t < 0.7 ? colorBud : colorCrimson;
      pts.push({ x, y, z, color: col });
    }

    // 2. Multi-tier concentric blooming petals (Fibonacci spiral arrangement)
    const layers = [
      // Layer 1: 3 inner petals embracing the bud closely
      { count: 3, rStart: 0.35, rEnd: 0.98, yBase: 0.12, yTop: 1.12, curl: -0.15, spread: 1.15, pts: 1400 },
      // Layer 2: 5 mid-inner petals opening upright with gentle cup
      { count: 5, rStart: 0.65, rEnd: 1.55, yBase: -0.05, yTop: 1.02, curl: 0.15, spread: 0.95, pts: 1800 },
      // Layer 3: 6 mid-outer petals blooming wider
      { count: 6, rStart: 1.1, rEnd: 2.15, yBase: -0.22, yTop: 0.82, curl: 0.5, spread: 0.85, pts: 2200 },
      // Layer 4: 7 outer petals gracefully recurving downwards
      { count: 7, rStart: 1.55, rEnd: 2.8, yBase: -0.42, yTop: 0.52, curl: 0.98, spread: 0.8, pts: 2500 },
      // Layer 5: 8 grand blooming outermost petals with scalloped edges
      { count: 8, rStart: 1.95, rEnd: 3.3, yBase: -0.58, yTop: 0.28, curl: 1.38, spread: 0.75, pts: 2300 },
    ];

    layers.forEach((layer, lIdx) => {
      const ptsPerPetal = Math.floor(layer.pts / layer.count);
      for (let p = 0; p < layer.count; p++) {
        // Golden angle offset between layers (~137.5 deg = 2.4 rad)
        const baseAngle = (p * (Math.PI * 2) / layer.count) + (lIdx * 2.39996);

        for (let j = 0; j < ptsPerPetal; j++) {
          const u = Math.sqrt(Math.random()); // higher density towards edge
          const v = (Math.random() - 0.5) * 2; // -1 to 1 across width
          // Natural petal profile: tapered base, broad middle, rounded wavy tip
          const width = Math.sin(Math.PI * Math.pow(u, 0.65)) * (1.0 - 0.12 * u);
          const theta = baseAngle + v * layer.spread * width;

          // Ruffled/wavy petal rim
          const ruffle = (u > 0.65) ? Math.sin(v * 9.0) * 0.08 * (u - 0.65) : 0;
          const r = layer.rStart + u * (layer.rEnd - layer.rStart) + ruffle - Math.abs(v) * 0.12;

          // Cup shape across width: edges curve gently upward
          const cup = -Math.pow(v, 2) * 0.3 * (1.0 - u * 0.55);
          // Vertical arch: rises then curves gracefully over
          const y = layer.yBase + u * (layer.yTop - layer.yBase) - Math.pow(u, 2.2) * layer.curl + cup;

          const x = Math.cos(theta) * r;
          const z = Math.sin(theta) * r;

          // Crystalline gradient color
          const isEdge = Math.abs(v) > 0.82 || u > 0.88;
          let col = colorRose;
          if (lIdx === 0) {
            col = isEdge ? colorHotPink : colorCrimson;
          } else if (lIdx === 1) {
            col = isEdge ? colorPink : colorHotPink;
          } else if (lIdx === 2) {
            col = isEdge ? colorSoftPink : colorPink;
          } else if (lIdx >= 3) {
            col = isEdge ? (Math.random() < 0.6 ? colorPrism : colorWhite) : colorSoftPink;
          }

          pts.push({ x, y, z, color: col });
        }
      }
    });

    const pos = new Float32Array(pts.length * 3);
    const col = new Float32Array(pts.length * 3);
    for (let i = 0; i < pts.length; i++) {
      pos[i * 3] = pts[i].x;
      pos[i * 3 + 1] = pts[i].y;
      pos[i * 3 + 2] = pts[i].z;

      col[i * 3] = pts[i].color.r;
      col[i * 3 + 1] = pts[i].color.g;
      col[i * 3 + 2] = pts[i].color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // Emerald Calyx (Receptacle & Sepals), Curved Stem, Thorns, and Rose Leaves
  const stemParticles = useMemo(() => {
    const pts: { x: number; y: number; z: number; color: THREE.Color }[] = [];

    const colorDarkEmerald = new THREE.Color("#064E3B");
    const colorEmerald = new THREE.Color("#059669");
    const colorMint = new THREE.Color("#10B981");
    const colorLightMint = new THREE.Color("#6EE7B7");
    const colorDewHighlight = new THREE.Color("#A7F3D0");

    // 1. Receptacle (swollen green bulb under the bloom)
    for (let i = 0; i < 500; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      const r = 0.35 + Math.random() * 0.08;
      const x = r * Math.sin(phi) * Math.cos(theta) * 1.1;
      const y = -0.55 + r * Math.cos(phi) * 0.7;
      const z = r * Math.sin(phi) * Math.sin(theta) * 1.1;
      pts.push({ x, y, z, color: colorDarkEmerald });
    }

    // 2. Five pointed Sepals (Đài hoa đỡ đóa hồng)
    for (let s = 0; s < 5; s++) {
      const baseAngle = s * ((Math.PI * 2) / 5) + 0.32;
      for (let j = 0; j < 250; j++) {
        const u = Math.random();
        const v = (Math.random() - 0.5) * 2;
        const w = Math.sin(Math.PI * u) * (1 - 0.7 * u) * 0.35;
        const theta = baseAngle + v * w;
        const r = 0.35 + u * 1.5;
        const y = -0.5 - u * 0.35 - Math.pow(u, 2) * 0.45;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        const col = u > 0.7 ? colorLightMint : colorMint;
        pts.push({ x, y, z, color: col });
      }
    }

    // 3. Curved stem with organic S-shape
    for (let i = 0; i < 1300; i++) {
      const t = Math.random();
      const y = -0.65 - t * 3.4;
      const centerX = Math.sin(y * 0.9) * 0.16;
      const centerZ = Math.cos(y * 0.8) * 0.12;

      const angle = Math.random() * Math.PI * 2;
      const rad = Math.random() * 0.06;
      const x = centerX + Math.cos(angle) * rad;
      const z = centerZ + Math.sin(angle) * rad;
      const col = Math.random() < 0.7 ? colorEmerald : colorDarkEmerald;
      pts.push({ x, y, z, color: col });
    }

    // 4. Subtle Thorns on stem
    const thornPositions = [
      { y: -1.2, angle: 1.8 },
      { y: -1.9, angle: -0.6 },
      { y: -2.8, angle: 2.5 },
    ];
    thornPositions.forEach((th) => {
      const sx = Math.sin(th.y * 0.9) * 0.16;
      const sz = Math.cos(th.y * 0.8) * 0.12;
      for (let k = 0; k < 60; k++) {
        const t = Math.random();
        const len = t * 0.18;
        const tx = sx + Math.cos(th.angle) * len;
        const tz = sz + Math.sin(th.angle) * len;
        const ty = th.y - Math.pow(t, 2) * 0.08;
        pts.push({ x: tx, y: ty, z: tz, color: colorMint });
      }
    });

    // 5. Two Compound Rose Leaves
    const leaves = [
      { branchY: -1.6, angle: 0.7, length: 1.35, width: 0.65, tilt: 0.22 },
      { branchY: -2.6, angle: -2.3, length: 1.15, width: 0.58, tilt: -0.15 },
    ];

    leaves.forEach((lf) => {
      const startX = Math.sin(lf.branchY * 0.9) * 0.16;
      const startZ = Math.cos(lf.branchY * 0.8) * 0.12;

      for (let i = 0; i < 550; i++) {
        const u = Math.random();
        const v = (Math.random() - 0.5) * 2;
        const bladeStart = 0.22;

        if (u < bladeStart) {
          // Petiole
          const d = (u / bladeStart) * 0.35;
          const lx = startX + Math.cos(lf.angle) * d + (Math.random() - 0.5) * 0.025;
          const lz = startZ + Math.sin(lf.angle) * d + (Math.random() - 0.5) * 0.025;
          const ly = lf.branchY + d * 0.18;
          pts.push({ x: lx, y: ly, z: lz, color: colorDarkEmerald });
        } else {
          // Leaf blade
          const bu = (u - bladeStart) / (1 - bladeStart);
          const bladeW = Math.sin(Math.PI * bu) * lf.width * (1 - 0.22 * bu);
          const dist = 0.35 + bu * lf.length;

          const perpX = -Math.sin(lf.angle);
          const perpZ = Math.cos(lf.angle);

          const cup = -Math.pow(v, 2) * 0.1;
          const ly = lf.branchY + 0.06 + bu * lf.tilt + cup;

          const lx = startX + Math.cos(lf.angle) * dist + perpX * v * bladeW;
          const lz = startZ + Math.sin(lf.angle) * dist + perpZ * v * bladeW;

          const isEdge = Math.abs(v) > 0.82;
          const isVein = Math.abs(v) < 0.12;
          const col = isEdge ? colorDewHighlight : isVein ? colorDarkEmerald : colorMint;
          pts.push({ x: lx, y: ly, z: lz, color: col });
        }
      }
    });

    const pos = new Float32Array(pts.length * 3);
    const col = new Float32Array(pts.length * 3);
    for (let i = 0; i < pts.length; i++) {
      pos[i * 3] = pts[i].x;
      pos[i * 3 + 1] = pts[i].y;
      pos[i * 3 + 2] = pts[i].z;

      col[i * 3] = pts[i].color.r;
      col[i * 3 + 1] = pts[i].color.g;
      col[i * 3 + 2] = pts[i].color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // Sparkling diamond dust at the heart of the rose bud
  const coreStardust = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gold = new THREE.Color("#FDE047");
    const pink = new THREE.Color("#FDA4AF");
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 0.45;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = 0.35 + (Math.random() - 0.5) * 0.35;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      const c = Math.random() < 0.6 ? gold : pink;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const hoverFactor = isHovered.current ? 1.6 : 1.0;
      groupRef.current.rotation.y += delta * 0.24 * hoverFactor;
      // Elegant natural tilt showing both the concentric spiral bloom and the slender leafy stem
      groupRef.current.rotation.x = 0.32 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.03;
    }
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 3.5) * 0.15;
      coreRef.current.scale.set(pulse, pulse, pulse);
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
      {/* Rose Bloom Petals */}
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

      {/* Calyx, Stem & Leaves */}
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
          size={0.055}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Sparkling Stardust at Bud Heart */}
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[coreStardust.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[coreStardust.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Warm Ambient Crystal Glow */}
      <pointLight position={[0, 0.45, 0]} intensity={2.8} color="#FB7185" distance={5} />

      {/* Invisible Interactive Click Area */}
      <mesh visible={false} position={[0, 0.2, 0]}>
        <sphereGeometry args={[2.8, 16, 16]} />
        <meshBasicMaterial />
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
      speedY: 0.35 + Math.random() * 0.4,
      rotSpeed: 0.6 + Math.random() * 1.0,
      scale: 0.2 + Math.random() * 0.15,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Custom curved petal geometry
  const petalGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.35, 0.5, 6, 6);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      // Delicate rose petal curve
      const pz = -Math.pow(px * 3.0, 2) * 0.1 + Math.sin(py * 4.0) * 0.05;
      pos.setZ(i, pz);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

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
      dummy.scale.set(petal.scale, petal.scale, petal.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[petalGeo, undefined, count]}>
      <meshBasicMaterial
        color="#FB7185"
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
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

      <Float position={[0, 0.6, 0]} speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
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
        camera={{ position: [0, 0, 11], fov: 52 }}
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
