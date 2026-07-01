import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { GiftContentOverlay } from "./GiftContentOverlay";

function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 2500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const colorInside = new THREE.Color("#ec4899"); // Pink
    const colorOutside = new THREE.Color("#818cf8"); // Purple/Indigo

    for (let i = 0; i < count; i++) {
      // Spiral configuration
      const r = Math.random() * 15;
      const spinAngle = r * 0.4;
      const branchAngle = ((i % 3) * 2 * Math.PI) / 3; // 3 arms

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;

      pos[i * 3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      pos[i * 3 + 1] = randomY;
      pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Lerp color based on radius
      const mixedColor = colorInside.clone().lerp(colorOutside, r / 15);
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    // Rotate the galaxy slowly
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const data = useMemo(() => ({
    speed: 0.15 + Math.random() * 0.2,
    xOffset: (Math.random() - 0.5) * 20,
    yOffset: 15,
  }), []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += data.speed;
    ref.current.position.y -= data.speed * 0.6;
    ref.current.position.z -= data.speed * 0.3;

    // Reset if it goes off screen
    if (ref.current.position.x > 18) {
      ref.current.position.x = -18;
      ref.current.position.y = 15;
    }
  });

  return (
    <mesh ref={ref} position={[-18, 15, -10]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

export function GalaxyCanvas3D({ gift }: { gift: any }) {
  const themeStyle = {
    textMain: "text-zinc-100",
    textSub: "text-zinc-400",
    cardBg: "bg-zinc-950/70 border border-zinc-800 shadow-2xl backdrop-blur-md",
    accentText: "text-purple-400",
    accentBg: "bg-gradient-to-r from-indigo-500 to-purple-500",
    borderColor: "border-zinc-800/60",
    glowColor: "#c084fc",
    heartColor: "#a855f7",
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#030712] flex items-center justify-center">
      {/* 3D R3F Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <Canvas camera={{ position: [0, 6, 20], fov: 60 }} gl={{ antialias: true }}>
          <color attach="background" args={["#030712"]} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 10, 0]} intensity={2.0} color="#a855f7" />
          
          {/* Starfield */}
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          
          <Galaxy />
          <ShootingStar />
          <ShootingStar />

          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>

      {/* HTML Content Overlay */}
      <GiftContentOverlay gift={gift} themeStyle={themeStyle} />
    </div>
  );
}
