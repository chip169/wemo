import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, X } from "lucide-react";

// ─── Pulsing Neural Network Heart ─────────────────────────────────────────────
function PulsingHeart({ onClick, opened }: { onClick: () => void; opened: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Generate Heart Neural Network Geometry
  const { positions, lines, colors } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const numPoints = 1500;

    for (let i = 0; i < numPoints; i++) {
      // Parametric coordinates mapping
      const theta = Math.random() * Math.PI;
      const phi = Math.random() * 2 * Math.PI;

      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      // 80% on surface shell, 20% slightly inner
      const r = i < numPoints * 0.8 ? 1.0 : 0.7 + 0.3 * Math.random();

      // Mathematical 3D Heart coordinates
      const x = r * 1.6 * Math.pow(sinTheta, 3) * Math.cos(phi);
      const y = r * (1.3 * cosTheta - 0.5 * Math.cos(2 * theta) - 0.2 * Math.cos(3 * theta) - 0.1 * Math.cos(4 * theta));
      const z = r * 1.6 * Math.pow(sinTheta, 3) * Math.sin(phi);

      const vec = new THREE.Vector3(x, y + 0.4, z); // Shift up slightly to center

      // Normal vector for wrinkle noise displacement
      const normal = vec.clone().normalize();

      // Gyri & Sulci (brain-like network wrinkle displacement)
      const scale = 14.0;
      const nx = vec.x * scale;
      const ny = vec.y * scale;
      const nz = vec.z * scale;

      const wave1 = Math.sin(nx + Math.cos(ny * 1.5));
      const wave2 = Math.cos(ny + Math.sin(nz * 1.5));
      const wave3 = Math.sin(nz + Math.cos(nx * 1.5));

      const noise = (wave1 + wave2 + wave3) / 3.0;
      const wrinkle = 1.0 - Math.abs(noise);

      // Displace point along normal
      vec.addScaledVector(normal, wrinkle * 0.15);
      (vec as any).wrinkle = wrinkle;

      pts.push(vec);
    }

    // Build neural synapses (connecting adjacent points)
    const linePositions: number[] = [];
    const maxDistance = 0.5;

    for (let i = 0; i < pts.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDistance) {
          linePositions.push(pts[i].x, pts[i].y, pts[i].z);
          linePositions.push(pts[j].x, pts[j].y, pts[j].z);
          connections++;
          if (connections > 3) break;
        }
      }
    }

    const positionsArray = new Float32Array(pts.length * 3);
    const colorsArray = new Float32Array(pts.length * 3);

    // Cyan, Purple, Pink color palette from the brain demo
    const colorPalette = [
      new THREE.Color('#38bdf8'), // Cyan
      new THREE.Color('#c084fc'), // Purple
      new THREE.Color('#f472b6'), // Pink
    ];

    for (let i = 0; i < pts.length; i++) {
      positionsArray[i * 3] = pts[i].x;
      positionsArray[i * 3 + 1] = pts[i].y;
      positionsArray[i * 3 + 2] = pts[i].z;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      // Points inside wrinkle valleys are darker, peaks are neon bright
      const brightness = 0.4 + (pts[i] as any).wrinkle * 0.6;

      colorsArray[i * 3] = color.r * brightness;
      colorsArray[i * 3 + 1] = color.g * brightness;
      colorsArray[i * 3 + 2] = color.b * brightness;
    }

    return {
      positions: positionsArray,
      lines: new Float32Array(linePositions),
      colors: colorsArray
    };
  }, []);

  const currentY = useRef(0);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Smoothly slide Y position up when opened, down when closed
    const targetY = opened ? 1.6 : 0;
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY, 0.05);
    groupRef.current.position.y = currentY.current + 0.4;
    
    // Heartbeat pulse frequency
    const pulse = 1.2 + Math.sin(t * 3.0) * 0.08;
    groupRef.current.scale.setScalar(hovered ? pulse * 1.1 : pulse);
    groupRef.current.rotation.y = t * 0.3;
  });

  return (
    <group
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Heart Neural network group */}
      <group ref={groupRef}>
        {/* Invisible raycast hit target inside the group to track movement */}
        <mesh>
          <sphereGeometry args={[2.2, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* Nodes */}
        <points raycast={() => null}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            vertexColors={true}
            transparent
            opacity={0.8}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Synapse line connections */}
        <lineSegments raycast={() => null}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={lines.length / 3} array={lines} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#f472b6"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* Click ring */}
      {!opened && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
          <torusGeometry args={[1.8, 0.03, 8, 60]} />
          <meshBasicMaterial color="#FF6B8A" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// ─── Orbiting Photo Frame ─────────────────────────────────────────────────────
function OrbitingPhoto({
  url,
  index,
  total,
  radius,
  speed,
  yOffset,
}: {
  url: string;
  index: number;
  total: number;
  radius: number;
  speed: number;
  yOffset: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [url]);

  const angleOffset = (index / total) * Math.PI * 2;

  useFrame((state) => {
    if (!ref.current) return;
    const angle = state.clock.elapsedTime * speed + angleOffset;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = yOffset + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;
    ref.current.rotation.y = -angle + Math.PI / 2;
  });

  return (
    <group ref={ref}>
      {/* Photo (Borderless & Double Sided) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Star Particles ───────────────────────────────────────────────────────────
function StarParticles({ count = 600 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FFAABB" size={0.15} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

// ─── Main 3D Scene ────────────────────────────────────────────────────────────
function HeartScene({ gift, opened, onOpen }: { gift: any; opened: boolean; onOpen: () => void }) {
  return (
    <>
      <color attach="background" args={["#0A0010"]} />
      <fog attach="fog" args={["#0A0010", 30, 80]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={4} color="#FF2D55" distance={20} />
      <pointLight position={[-5, -3, 5]} intensity={2} color="#FF758F" distance={15} />
      <pointLight position={[5, -3, -5]} intensity={1.5} color="#c084fc" distance={15} />

      <Stars radius={80} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <StarParticles />

      <Float floatIntensity={0.6} speed={1.5} rotationIntensity={0.1}>
        <PulsingHeart onClick={onOpen} opened={opened} />
      </Float>

      {opened &&
        (gift.photos || []).map((url: string, i: number) => (
          <OrbitingPhoto
            key={url}
            url={url}
            index={i}
            total={(gift.photos || []).length}
            radius={5 + (i % 2) * 1.5}
            speed={0.25 + (i % 3) * 0.07}
            yOffset={1.6 + (i % 3 - 1) * 1.2}
          />
        ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
        autoRotate={!opened}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// ─── Overlay Content ──────────────────────────────────────────────────────────
function MessageOverlay({ gift, onClose }: { gift: any; onClose: () => void }) {
  const words = useMemo(() => {
    const text = gift.message || "Chúc bạn luôn hạnh phúc và tràn đầy yêu thương! 💖";
    return text.split(" ");
  }, [gift.message]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-8 px-4 pointer-events-none"
    >
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#0A0010] via-[#0A0010]/60 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm pointer-events-auto">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="bg-black/60 border border-[#FF2D55]/30 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_40px_rgba(255,45,85,0.2)]">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-[#FF2D55] fill-[#FF2D55]" />
            <span className="text-[#FF758F] text-xs font-semibold uppercase tracking-widest">
              Lời chúc từ trái tim
            </span>
          </div>

          <h2 className="text-white text-xl font-bold mb-1">
            Gửi {gift.recipientName || "bạn yêu quý"} 💕
          </h2>

          {gift.title && (
            <p className="text-[#FF758F] text-sm font-medium mb-2">{gift.title}</p>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-x-1 gap-y-0.5 text-zinc-200 text-sm leading-relaxed mb-4 max-h-[150px] overflow-y-auto pr-1 no-scrollbar"
          >
            {words.map((word, idx) => (
              <motion.span key={idx} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.div>

          {gift.senderName && (
            <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/10">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span className="text-zinc-400 text-xs">Từ {gift.senderName}</span>
            </div>
          )}
        </div>

        {(gift.photos || []).length > 0 && (
          <p className="text-center text-[#FF758F]/60 text-xs mt-3">
            ✨ {(gift.photos || []).length} bức ảnh đang xoay xung quanh trái tim
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ClickHintOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 pointer-events-none"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-10 h-10 rounded-full bg-[#FF2D55]/20 border border-[#FF2D55]/50 flex items-center justify-center"
      >
        <Heart className="w-5 h-5 text-[#FF2D55] fill-[#FF2D55]" />
      </motion.div>
      <p className="text-white/50 text-xs">Chạm vào trái tim để mở thiệp</p>
    </motion.div>
  );
}

export function HeartCanvas3D({ gift }: { gift: any }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0010]">
      <Canvas
        camera={{ position: [0, 1, 12], fov: 55 }}
        gl={{ antialias: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <HeartScene gift={gift} opened={opened} onOpen={() => setOpened(true)} />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {!opened && <ClickHintOverlay key="hint" />}
          {opened && (
            <MessageOverlay
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
            className="flex items-center gap-2 bg-black/30 border border-[#FF2D55]/20 rounded-full px-4 py-1.5 backdrop-blur-sm"
          >
            <Heart className="w-3 h-3 text-[#FF2D55] fill-[#FF2D55]" />
            <span className="text-white/70 text-xs tracking-widest uppercase">Thiệp quà 3D</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
