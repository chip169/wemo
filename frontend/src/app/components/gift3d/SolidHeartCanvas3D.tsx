import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Star, X } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

// ─── Interactive Pink Planet with Sparkling Surface ─────────────────────────
function InteractivePlanet({ onClick, opened }: { onClick: () => void; opened: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const isHovered = useRef(false);

  // Generate 4200 particles to form a volumetric planet sphere with interleaved pink/white colors
  const planetParticles = useMemo(() => {
    const count = 4200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPink = new THREE.Color("#FF7BB0"); // glowing pink
    const colorWhite = new THREE.Color("#FFFFFF"); // glowing white

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      // Soft thickness/volumetric radius for the sphere (r=1.9 to 2.05)
      const r = 1.9 + Math.random() * 0.15;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Pink and white colors interleaved (75% pink)
      const mixedColor = Math.random() < 0.75 ? colorPink : colorWhite;
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // Generate 3500 particles to form a flat Saturn ring with interleaved pink/white colors
  const ringParticles = useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPink = new THREE.Color("#FF69B4");
    const colorWhite = new THREE.Color("#FFFFFF");

    for (let i = 0; i < count; i++) {
      // Ring radius between 2.4 and 4.6
      const r = 2.4 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08; // very flat thickness on Y
      pos[i * 3 + 2] = Math.sin(angle) * r;

      // Pink and white colors interleaved (75% pink)
      const mixedColor = Math.random() < 0.75 ? colorPink : colorWhite;
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const currentY = useRef(0);
  const currentSpeed = useRef(0.12);
  const rotationY = useRef(0);
  const currentScale = useRef(1);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smoothly slide Y position up when opened, down when closed
    const targetY = opened ? 1.6 : 0;
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY, 0.05);
    groupRef.current.position.y = currentY.current;

    // Smoothly lerp rotation speed
    const targetSpeed = isHovered.current ? 0.35 : 0.12;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, 0.08);

    // Accumulate rotation angle
    rotationY.current += currentSpeed.current * delta;
    groupRef.current.rotation.y = rotationY.current;

    // Wobble and tilt for a beautiful 3D Saturn view
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
    groupRef.current.rotation.x = Math.PI / 6 + Math.cos(t * 0.2) * 0.03;

    // Pulsing + Hover scale effect
    const basePulse = 1.0 + Math.sin(t * 2.5) * 0.03;
    const targetScale = isHovered.current ? basePulse * 1.15 : basePulse;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
    groupRef.current.scale.setScalar(currentScale.current);
  });

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerOver={() => { isHovered.current = true; }}
      onPointerOut={() => { isHovered.current = false; }}
    >
      {/* Invisible raycast hit target sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. Volumetric Planet Sphere (Point Cloud of Pink & White particles) */}
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" count={planetParticles.positions.length / 3} array={planetParticles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={planetParticles.colors.length / 3} array={planetParticles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.95}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Saturn Ring (Point Cloud of Pink & White particles) */}
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" count={ringParticles.positions.length / 3} array={ringParticles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={ringParticles.colors.length / 3} array={ringParticles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.85}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ─── Floating Space Decoration (Hearts and Roses) ───────────────────────────
function FloatingDeco({
  item,
  heartGeo,
  roseGeo,
}: {
  item: any;
  heartGeo: THREE.BufferGeometry;
  roseGeo: THREE.BufferGeometry;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const angle = t * item.speed + item.angleOffset;

    // Orbital coordinates
    ref.current.position.x = Math.cos(angle) * item.radius;
    ref.current.position.z = Math.sin(angle) * item.radius;
    ref.current.position.y = item.yOffset + Math.sin(t * 0.7 + item.angleOffset) * 0.35;

    // Tumbling rotation
    ref.current.rotation.x = t * 0.4 + item.angleOffset;
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <group ref={ref} scale={item.scale}>
      {item.type === "heart" ? (
        <mesh geometry={heartGeo}>
          <meshStandardMaterial
            color={item.color}
            roughness={0.15}
            metalness={0.8}
            emissive={item.color}
            emissiveIntensity={0.25}
          />
        </mesh>
      ) : (
        <group>
          {/* Outer Petals */}
          <mesh geometry={roseGeo}>
            <meshStandardMaterial color="#D2143A" roughness={0.22} metalness={0.4} />
          </mesh>
          {/* Inner Petals (Scaled and rotated) */}
          <mesh geometry={roseGeo} scale={0.7} rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.04]}>
            <meshStandardMaterial color="#A30B24" roughness={0.22} metalness={0.5} />
          </mesh>
          {/* Center Bud */}
          <mesh position={[0, 0, 0.08]} scale={[0.3, 0.3, 0.4]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#800517" roughness={0.1} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ─── Orbiting Polaroid Card with Rounded Corners ─────────────────────────────
function OrbitingPhoto({
  url,
  index,
  total,
  radius,
  speed,
  yOffset,
  roundedCardGeometry,
  roundedBorderGeometry,
  isPaused,
  onPause,
}: {
  url: string;
  index: number;
  total: number;
  radius: number;
  speed: number;
  yOffset: number;
  roundedCardGeometry: THREE.BufferGeometry;
  roundedBorderGeometry: THREE.BufferGeometry;
  isPaused: boolean;
  onPause: (paused: boolean) => void;
}) {
  const ref = useRef<THREE.Group>(null);

  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 16;
    return t;
  }, [url]);

  const angleOffset = (index / total) * Math.PI * 2;
  const angleRef = useRef(angleOffset);
  const currentY = useRef(-15); // Start below screen to fly up

  // Random tilts to match user screenshot layout
  const zRot = useMemo(() => (Math.random() - 0.5) * 0.3, []);
  const tiltX = useMemo(() => (Math.random() - 0.5) * 0.15, []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (!isPaused) {
      angleRef.current += delta * speed;
    }
    const angle = angleRef.current;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;

    // Floating oscillation
    const targetY = yOffset + Math.sin(state.clock.elapsedTime * 0.45 + index) * 0.35;

    // Smoothly fly up from below using lerp
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY, 0.035);
    ref.current.position.y = currentY.current;

    // Face the center (Saturn ring plane)
    ref.current.rotation.y = -angle + Math.PI / 2;
    ref.current.rotation.z = zRot;
    ref.current.rotation.x = tiltX;
  });

  return (
    <group ref={ref}>
      {/* Polaroid Photo Canvas (White border removed) */}
      <mesh
        geometry={roundedCardGeometry}
        position={[0, 0, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onPause(true);
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          onPause(false);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          onPause(false);
          document.body.style.cursor = "auto";
        }}
        onPointerCancel={(e) => {
          e.stopPropagation();
          onPause(false);
          document.body.style.cursor = "auto";
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
        }}
      >
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function NebulaParticles({ count = 14000 }) {
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPink = new THREE.Color("#FF1E82"); // hot pink
    const colorWhite = new THREE.Color("#FFFFFF");
    const colorPurple = new THREE.Color("#A855F7"); // purple

    for (let i = 0; i < count; i++) {
      // Swirling vertical cylinder shell pattern
      const r = 6.2 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 15.0;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      // Color picker: 75% pink, 17% white, 8% purple
      const rand = Math.random();
      let mixedColor;
      if (rand < 0.75) {
        mixedColor = colorPink;
      } else if (rand < 0.92) {
        mixedColor = colorWhite;
      } else {
        mixedColor = colorPurple;
      }
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  const rotationY = useRef(0);
  useFrame((state, delta) => {
    if (ref.current) {
      rotationY.current += 0.025 * delta;
      ref.current.rotation.y = rotationY.current;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.85}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Shooting Stars ──────────────────────────────────────────────────────────
function ShootingStar({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null);
  const speed = useMemo(() => 14 + Math.random() * 8, []);

  // Staggered flight configurations from multiple screen corners/axes
  const config = useMemo(() => {
    const type = index % 3;
    const colorPink = "#FF5CA8";
    const colorBlue = "#38BDF8";
    const colorYellow = "#FBBF24";

    if (type === 0) {
      // Top-left to bottom-right
      return {
        startX: -28 - Math.random() * 10,
        startY: 15 + Math.random() * 8,
        startZ: -15 + Math.random() * 10,
        dir: new THREE.Vector3(1.3, -0.7, -0.2).normalize(),
        color: colorPink
      };
    } else if (type === 1) {
      // Top-right to bottom-left
      return {
        startX: 28 + Math.random() * 10,
        startY: 15 + Math.random() * 8,
        startZ: -15 + Math.random() * 10,
        dir: new THREE.Vector3(-1.3, -0.7, -0.2).normalize(),
        color: colorBlue
      };
    } else {
      // Top-center downwards (steep angle)
      return {
        startX: (Math.random() - 0.5) * 20,
        startY: 22 + Math.random() * 6,
        startZ: -20 + Math.random() * 10,
        dir: new THREE.Vector3(0.35, -1.3, 0.1).normalize(),
        color: colorYellow
      };
    }
  }, [index]);

  // Launch delays: staggered by index
  const delay = index * 1.8;
  const pos = useRef(new THREE.Vector3());
  const progress = useRef(0);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    if (t < delay) {
      ref.current.visible = false;
      return;
    }

    const cycleDuration = 1.3;
    const cyclePeriod = 5.2; // flight time + cooldown before respawning
    const localTime = (t - delay) % cyclePeriod;

    if (localTime < cycleDuration) {
      ref.current.visible = true;
      progress.current = localTime / cycleDuration;

      const dist = progress.current * speed * cycleDuration;
      pos.current.set(
        config.startX + config.dir.x * dist,
        config.startY + config.dir.y * dist,
        config.startZ + config.dir.z * dist
      );
      ref.current.position.copy(pos.current);

      // Face direction of motion
      ref.current.lookAt(
        pos.current.x + config.dir.x,
        pos.current.y + config.dir.y,
        pos.current.z + config.dir.z
      );
    } else {
      ref.current.visible = false;
    }
  });

  return (
    <group ref={ref}>
      {/* Meteor Head: Bright White Glow */}
      <mesh>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Meteor Tail: Fading trail extending backwards along Z-axis */}
      <mesh position={[0, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.055, 2.4, 6]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ShootingStars() {
  return (
    <group>
      {Array.from({ length: 10 }).map((_, i) => (
        <ShootingStar key={i} index={i} />
      ))}
    </group>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
function GalaxyScene({ gift, opened, onOpen }: { gift: any; opened: boolean; onOpen: () => void }) {
  const [isPaused, setIsPaused] = useState(false);

  // 1. Extruded Small Heart Shape for decorations
  const heartGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.3);
    s.bezierCurveTo(-0.4, 0.1, -0.7, 0.4, -0.7, 0.7);
    s.bezierCurveTo(-0.7, 1.0, -0.4, 1.3, 0, 0.85);
    s.bezierCurveTo(0.4, 1.3, 0.7, 1.0, 0.7, 0.7);
    s.bezierCurveTo(0.7, 0.4, 0.4, 0.1, 0, -0.3);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.03, bevelThickness: 0.03 });
    geo.center();
    return geo;
  }, []);

  // 2. Extruded Rose Flower Shape (Wavy outlines)
  const roseGeo = useMemo(() => {
    const s = new THREE.Shape();
    const petals = 6;
    for (let i = 0; i < petals * 2; i++) {
      const angle = (i / (petals * 2)) * Math.PI * 2;
      // Rose petal wavy contours
      const r = 0.5 + Math.sin(angle * 3.5) * 0.15 + Math.cos(angle * 6.5) * 0.08;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.04, bevelThickness: 0.04 });
    geo.center();
    return geo;
  }, []);

  // 3. Rounded Rectangle Shapes for Polaroid Cards
  const roundedCardGeometry = useMemo(() => {
    const width = 1.5;
    const height = 1.5;
    const radius = 0.14;
    const s = new THREE.Shape();
    s.moveTo(-width / 2 + radius, -height / 2);
    s.lineTo(width / 2 - radius, -height / 2);
    s.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    s.lineTo(width / 2, height / 2 - radius);
    s.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    s.lineTo(-width / 2 + radius, height / 2);
    s.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    s.lineTo(-width / 2, -height / 2 + radius);
    s.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
    return new THREE.ShapeGeometry(s);
  }, []);

  const roundedBorderGeometry = useMemo(() => {
    const width = 1.62;
    const height = 1.62;
    const radius = 0.16;
    const s = new THREE.Shape();
    s.moveTo(-width / 2 + radius, -height / 2);
    s.lineTo(width / 2 - radius, -height / 2);
    s.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    s.lineTo(width / 2, height / 2 - radius);
    s.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    s.lineTo(-width / 2 + radius, height / 2);
    s.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    s.lineTo(-width / 2, -height / 2 + radius);
    s.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
    return new THREE.ShapeGeometry(s);
  }, []);

  // 4. Generate random floating decorations orbiting the space (7 Hearts & 3 Roses)
  const decoItems = useMemo(() => {
    const list = [];
    // 7 hearts
    for (let i = 0; i < 7; i++) {
      list.push({
        type: "heart",
        speed: 0.12 + Math.random() * 0.22,
        radius: 4.8 + Math.random() * 3.6,
        angleOffset: Math.random() * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 5.0,
        scale: 0.16 + Math.random() * 0.14,
        color: i % 2 === 0 ? "#FF0520" : "#D2143A",
      });
    }
    // 3 roses
    for (let i = 0; i < 3; i++) {
      list.push({
        type: "rose",
        speed: 0.12 + Math.random() * 0.22,
        radius: 4.8 + Math.random() * 3.6,
        angleOffset: Math.random() * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 5.0,
        scale: 0.24 + Math.random() * 0.12, // Roses slightly larger
        color: "#D2143A",
      });
    }
    return list;
  }, []);

  // 5. Generate dense orbiting photo frames (Duplicated to form a nice circle)
  const displayPhotos = useMemo(() => {
    const original = gift.photos || [];
    if (original.length === 0) return [];

    let list: { url: string; stableKey: string }[] = original.map((url: string, i: number) => ({ url, stableKey: `orig-${i}-${url}` }));
    let cycle = 0;
    while (list.length < 16) {
      cycle++;
      const toAdd = original.map((url: string, i: number) => ({ url, stableKey: `dup-${cycle}-${i}-${url}` }));
      list = [...list, ...toAdd];
    }
    return list.slice(0, Math.max(16, original.length));
  }, [gift.photos]);

  return (
    <>
      {/* Deep purple/black space background to match screenshot */}
      <color attach="background" args={["#0D0214"]} />
      <fog attach="fog" args={["#0D0214", 30, 80]} />

      <ambientLight intensity={0.65} />
      <pointLight position={[0, 6, 0]} intensity={5.5} color="#FF69B4" distance={25} />
      <pointLight position={[-8, -5, 8]} intensity={3} color="#4F46E5" distance={20} />
      <pointLight position={[8, -5, -8]} intensity={2.5} color="#D946EF" distance={20} />

      <Stars radius={90} depth={60} count={6000} factor={6} saturation={0.6} fade speed={1.2} />
      <NebulaParticles />
      <ShootingStars />

      {/* Floating 3D Hearts & Roses */}
      {decoItems.map((item, idx) => (
        <FloatingDeco key={idx} item={item} heartGeo={heartGeo} roseGeo={roseGeo} />
      ))}

      <Float floatIntensity={0.3} speed={1.0} rotationIntensity={0.05}>
        <InteractivePlanet onClick={onOpen} opened={opened} />
      </Float>

      {/* Orbiting Polaroid Cards with rounded corners */}
      {opened &&
        displayPhotos.map((item: { url: string; stableKey: string }, i: number) => (
          <OrbitingPhoto
            key={item.stableKey}
            url={item.url}
            index={i}
            total={displayPhotos.length}
            radius={6.2 + (i % 3) * 1.0}
            speed={0.16 + (i % 4) * 0.03}
            yOffset={(i % 4 - 1.5) * 1.4}
            roundedCardGeometry={roundedCardGeometry}
            roundedBorderGeometry={roundedBorderGeometry}
            isPaused={isPaused}
            onPause={setIsPaused}
          />
        ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
        autoRotate={!opened}
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ─── UI Overlay Content ────────────────────────────────────────────────────────
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
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#0D0214] via-[#0D0214]/80 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm pointer-events-auto">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="bg-black/70 border border-pink-500/35 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_40px_rgba(244,114,182,0.25)]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span className="text-pink-300 text-xs font-semibold uppercase tracking-widest">
              Thông điệp từ vũ trụ
            </span>
          </div>

          <h2 className="text-white text-xl font-bold mb-1">
            Gửi {gift.recipientName || "bạn yêu quý"} 💕
          </h2>

          {gift.title && (
            <p className="text-pink-300 text-sm font-medium mb-2">{gift.title}</p>
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

          {/* Voice voice message */}
          {gift.voiceUrl && (
            <div className="mb-4 pointer-events-auto">
              <AudioPlayerWidget
                src={gift.voiceUrl}
                themeStyle={{
                  cardBg: "bg-white/10",
                  borderColor: "border-white/10",
                  accentBg: "bg-pink-500",
                  accentText: "text-pink-300",
                  textMain: "text-white",
                  textSub: "text-zinc-400",
                }}
              />
            </div>
          )}

          {/* Video message */}
          {gift.videoUrl && (
            <div className="mb-4 pointer-events-auto">
              <VideoPlayerWidget
                src={gift.videoUrl}
                themeStyle={{
                  borderColor: "border-white/10",
                }}
              />
            </div>
          )}

          {gift.senderName && (
            <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/10">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-zinc-400 text-xs">Từ {gift.senderName}</span>
            </div>
          )}
        </div>

        {(gift.photos || []).length > 0 && (
          <p className="text-center text-pink-300/60 text-xs mt-3">
            ✨ Ấn giữ ảnh để tạm dừng xoay • Kéo để xoay camera
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
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 pointer-events-none"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/50 flex items-center justify-center"
      >
        <Sparkles className="w-5 h-5 text-pink-400 fill-pink-400" />
      </motion.div>
      <p className="text-white/50 text-xs">Chạm vào tinh cầu để khám phá thiệp</p>
    </motion.div>
  );
}

export function SolidHeartCanvas3D({ gift }: { gift: any }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0D0214]">
      <Canvas
        camera={{ position: [0, 1, 12], fov: 55 }}
        gl={{ antialias: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <GalaxyScene gift={gift} opened={opened} onOpen={() => setOpened(true)} />
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
            className="flex items-center gap-2 bg-black/30 border border-pink-500/20 rounded-full px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 text-pink-400 fill-pink-400" />
            <span className="text-white/70 text-xs tracking-widest uppercase">Mẫu Tinh Cầu Hồng 3D</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
