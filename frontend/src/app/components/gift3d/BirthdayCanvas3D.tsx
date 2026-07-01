import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GiftContentOverlay } from "./GiftContentOverlay";

function Balloon({ color, startPos, speed, scale }: { color: string; startPos: [number, number, number]; speed: number; scale: number }) {
  const ref = useRef<THREE.Group>(null);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (!ref.current) return;
    // Float upwards
    ref.current.position.y += speed;
    
    // Sway gently
    ref.current.position.x = startPos[0] + Math.sin(state.clock.getElapsedTime() + timeOffset) * 1.5;
    
    // Reset if too high
    if (ref.current.position.y > 25) {
      ref.current.position.y = -25;
    }
  });

  return (
    <group ref={ref} position={startPos} scale={[scale, scale, scale]}>
      {/* Balloon body */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Balloon tie at bottom */}
      <mesh position={[0, -0.95, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Balloons() {
  const colors = ["#FF6B8A", "#FFD4D4", "#FF9A9E", "#FECFEF", "#FFE066", "#6BE3FF", "#B0FF6B"];
  const list = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      color: colors[Math.floor(Math.random() * colors.length)],
      startPos: [
        (Math.random() - 0.5) * 20, // x
        (Math.random() - 0.5) * 40 - 10, // y
        (Math.random() - 0.5) * 15 - 5, // z
      ] as [number, number, number],
      speed: 0.04 + Math.random() * 0.05,
      scale: 0.6 + Math.random() * 0.6,
    }));
  }, []);

  return (
    <group>
      {list.map((b, i) => (
        <Balloon key={i} color={b.color} startPos={b.startPos} speed={b.speed} scale={b.scale} />
      ))}
    </group>
  );
}

function ConfettiPiece({ color, startPos, speed, rotSpeed }: { color: string; startPos: [number, number, number]; speed: number; rotSpeed: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y -= speed;
    ref.current.rotation.x += rotSpeed[0];
    ref.current.rotation.y += rotSpeed[1];
    ref.current.rotation.z += rotSpeed[2];

    if (ref.current.position.y < -25) {
      ref.current.position.y = 25;
      ref.current.position.x = (Math.random() - 0.5) * 25;
    }
  });

  return (
    <mesh ref={ref} position={startPos}>
      <planeGeometry args={[0.3, 0.15]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.3} />
    </mesh>
  );
}

function ConfettiShower() {
  const colors = ["#FF4D4D", "#FF9A9E", "#FFE066", "#4DFF88", "#4D88FF", "#E64DFF"];
  const list = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      color: colors[Math.floor(Math.random() * colors.length)],
      startPos: [
        (Math.random() - 0.5) * 25,
        Math.random() * 50 - 25,
        (Math.random() - 0.5) * 15 - 5,
      ] as [number, number, number],
      speed: 0.05 + Math.random() * 0.08,
      rotSpeed: [
        Math.random() * 0.03,
        Math.random() * 0.03,
        Math.random() * 0.03,
      ] as [number, number, number],
    }));
  }, []);

  return (
    <group>
      {list.map((c, i) => (
        <ConfettiPiece key={i} color={c.color} startPos={c.startPos} speed={c.speed} rotSpeed={c.rotSpeed} />
      ))}
    </group>
  );
}

export function BirthdayCanvas3D({ gift }: { gift: any }) {
  const themeStyle = {
    textMain: "text-stone-800",
    textSub: "text-stone-500",
    cardBg: "bg-white/60 border border-white/70 shadow-xl backdrop-blur-md",
    accentText: "text-[#D4AF78]",
    accentBg: "bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]",
    borderColor: "border-[#E8B4A8]/30",
    glowColor: "#D4AF78",
    heartColor: "#E8B4A8",
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#FFFBF0] flex items-center justify-center">
      {/* 3D R3F Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: true }}>
          <color attach="background" args={["#FFFBF0"]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#fffcf2" />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#FFE066" />
          
          <Balloons />
          <ConfettiShower />

          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>

      {/* HTML Content Overlay */}
      <GiftContentOverlay gift={gift} themeStyle={themeStyle} />
    </div>
  );
}
