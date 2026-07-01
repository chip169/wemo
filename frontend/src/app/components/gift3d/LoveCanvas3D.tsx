import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GiftContentOverlay } from "./GiftContentOverlay";

function Heart3D({ geometry, color, startPos, speed, rotSpeed }: { geometry: THREE.ExtrudeGeometry; color: string; startPos: [number, number, number]; speed: number; rotSpeed: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (!ref.current) return;
    // Float upwards
    ref.current.position.y += speed;
    
    // Sway left/right
    ref.current.position.x = startPos[0] + Math.sin(state.clock.getElapsedTime() * 0.8 + timeOffset) * 1.2;

    // Rotate
    ref.current.rotation.x += rotSpeed[0];
    ref.current.rotation.y += rotSpeed[1];
    ref.current.rotation.z += rotSpeed[2];

    // Reset if too high
    if (ref.current.position.y > 25) {
      ref.current.position.y = -25;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry} position={startPos}>
      <meshStandardMaterial 
        color={color} 
        roughness={0.15} 
        metalness={0.1} 
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function HeartsUniverse() {
  const colors = ["#FF4D6D", "#FF758F", "#FF8FA3", "#FFB3C1", "#FFCCD5", "#FFF0F4"];

  // 1. Create Heart Shape
  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.6);
    s.bezierCurveTo(-0.8, 0.2, -1.4, 0.8, -1.4, 1.4);
    s.bezierCurveTo(-1.4, 2.0, -0.8, 2.6, 0, 1.7);
    s.bezierCurveTo(0.8, 2.6, 1.4, 2.0, 1.4, 1.4);
    s.bezierCurveTo(1.4, 0.8, 0.8, 0.2, 0, -0.6);
    return s;
  }, []);

  // 2. Extrude settings to make the heart 3D
  const extrudeSettings = useMemo(() => ({
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06
  }), []);

  // 3. Reuse geometry across meshes for performance
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(heartShape, extrudeSettings), [heartShape, extrudeSettings]);

  const list = useMemo(() => {
    return Array.from({ length: 45 }).map(() => ({
      color: colors[Math.floor(Math.random() * colors.length)],
      startPos: [
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 45 - 5,
        (Math.random() - 0.5) * 12 - 4,
      ] as [number, number, number],
      speed: 0.03 + Math.random() * 0.04,
      rotSpeed: [
        0.005 + Math.random() * 0.015,
        0.005 + Math.random() * 0.015,
        Math.random() * 0.01,
      ] as [number, number, number],
    }));
  }, []);

  return (
    <group>
      {list.map((h, i) => (
        <Heart3D key={i} geometry={geometry} color={h.color} startPos={h.startPos} speed={h.speed} rotSpeed={h.rotSpeed} />
      ))}
    </group>
  );
}

export function LoveCanvas3D({ gift }: { gift: any }) {
  const themeStyle = {
    textMain: "text-[#3D1D2C]",
    textSub: "text-stone-500",
    cardBg: "bg-white/60 border border-[#FFCCD5]/80 shadow-xl backdrop-blur-md",
    accentText: "text-[#E11D48]",
    accentBg: "bg-gradient-to-r from-[#FF758F] to-[#E11D48]",
    borderColor: "border-[#FFCCD5]/40",
    glowColor: "#FF4D6D",
    heartColor: "#E11D48",
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#FFF0F4] flex items-center justify-center">
      {/* 3D R3F Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: true }}>
          <color attach="background" args={["#FFF0F4"]} />
          
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 8, 3]} intensity={1.5} color="#fff2f5" />
          <pointLight position={[-3, 5, -3]} intensity={0.8} color="#FF758F" />
          <pointLight position={[3, -5, 3]} intensity={0.4} color="#FFF0F4" />

          <HeartsUniverse />

          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>

      {/* HTML Content Overlay */}
      <GiftContentOverlay gift={gift} themeStyle={themeStyle} />
    </div>
  );
}
