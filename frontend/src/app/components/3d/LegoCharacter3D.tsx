import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ─── LEGO Color Palette (Authentic ABS Plastic) ─────────────────────────────
const LEGO_COLORS = {
  bearBrown: "#BD7A36",       // Warm Caramel ABS Plastic
  bearDarkBrown: "#8F531B",   // Shading / Nose / Back
  creamBelly: "#FCECD2",      // Creamy chest & muzzle
  pinkHeart: "#FF6584",       // Translucent candy heart
  shirtWhite: "#FFFFFF",      // WEMO studio tee
  eyeBlack: "#18100C",        // Glossy black eye pupil
  eyeIris: "#5A3010",         // Warm amber eye iris
  cheeks: "#FF8A7A",          // Rosy cheek blush
  studGold: "#E5A93C",        // Accent studs
};

// ─── Reusable Lego Stud Component ───────────────────────────────────────────
function LegoStud({ position, rotation = [0, 0, 0], scale = [1, 1, 1], color = LEGO_COLORS.bearBrown }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Outer Stud Ring */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Subtle Embossed Ring on Top */}
      <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.18, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ─── Lego C-Hand Component ──────────────────────────────────────────────────
function LegoHand({ position, rotation = [0, 0, 0], color = LEGO_COLORS.bearBrown }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Hand wrist cylinder */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.3, 16]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>

      {/* C-curve: Open torus arc representing authentic Lego claw */}
      <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.1, 16, 28, Math.PI * 1.45]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          clearcoat={0.85}
        />
      </mesh>
    </group>
  );
}

// ─── Procedural Trapezoid Torso Geometry ────────────────────────────────────
function LegoTorso({ color = LEGO_COLORS.shirtWhite }: { color?: string }) {
  const torsoGeometry = useMemo(() => {
    // Lego torso shape: trapezoid (wider at bottom, narrower at top)
    const shape = new THREE.Shape();
    const topW = 0.95;
    const botW = 1.25;
    const h = 1.6;

    shape.moveTo(-botW / 2, -h / 2);
    shape.lineTo(botW / 2, -h / 2);
    shape.lineTo(topW / 2, h / 2);
    shape.lineTo(-topW / 2, h / 2);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.85,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  return (
    <group>
      <mesh geometry={torsoGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.22}
          clearcoat={0.8}
          clearcoatRoughness={0.12}
        />
      </mesh>

      {/* Cream Belly Patch or WEMO shirt detail */}
      <mesh position={[0, -0.05, 0.46]}>
        <planeGeometry args={[0.8, 1.1]} />
        <meshBasicMaterial color={LEGO_COLORS.creamBelly} transparent opacity={0.9} />
      </mesh>

      {/* "WEMO" subtle logo badge on chest */}
      <mesh position={[0, 0.28, 0.465]}>
        <planeGeometry args={[0.55, 0.22]} />
        <meshBasicMaterial color="#5C352E" />
      </mesh>
      <mesh position={[0, 0.28, 0.47]}>
        <planeGeometry args={[0.48, 0.15]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// ─── Lego Head with Bear Ears & Cute Face ───────────────────────────────────
function LegoHead({ headRef }: { headRef: React.RefObject<THREE.Group> }) {
  return (
    <group ref={headRef} position={[0, 1.35, 0]}>
      {/* Neck connector cylinder */}
      <mesh position={[0, -0.68, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.4, 0.28, 24]} />
        <meshPhysicalMaterial
          color={LEGO_COLORS.bearBrown}
          roughness={0.2}
          clearcoat={0.9}
        />
      </mesh>

      {/* Main Minifigure Cylindrical Head */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.84, 1.1, 32]} />
        <meshPhysicalMaterial
          color={LEGO_COLORS.bearBrown}
          roughness={0.18}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Head Top Cap (Dome-like curve) */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.82, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        <meshPhysicalMaterial
          color={LEGO_COLORS.bearBrown}
          roughness={0.18}
          clearcoat={0.95}
        />
      </mesh>

      {/* Classic Center Top Stud */}
      <LegoStud position={[0, 0.85, 0]} color={LEGO_COLORS.bearBrown} scale={[1.2, 1.1, 1.2]} />

      {/* ── Left Bear Ear with Lego Stud ── */}
      <group position={[-0.75, 0.65, 0]} rotation={[0, 0, 0.35]}>
        {/* Ear base rounded shell */}
        <mesh castShadow>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearBrown}
            roughness={0.2}
            clearcoat={0.9}
          />
        </mesh>
        {/* Ear inner cream cup */}
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[0.2, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.creamBelly} />
        </mesh>
        {/* Authentic LEGO stud on top of ear */}
        <LegoStud position={[0, 0.35, 0]} color={LEGO_COLORS.bearBrown} scale={[0.85, 0.85, 0.85]} />
      </group>

      {/* ── Right Bear Ear with Lego Stud ── */}
      <group position={[0.75, 0.65, 0]} rotation={[0, 0, -0.35]}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearBrown}
            roughness={0.2}
            clearcoat={0.9}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[0.2, 20]} />
          <meshBasicMaterial color={LEGO_COLORS.creamBelly} />
        </mesh>
        <LegoStud position={[0, 0.35, 0]} color={LEGO_COLORS.bearBrown} scale={[0.85, 0.85, 0.85]} />
      </group>

      {/* ── Cute Snout / Muzzle ── */}
      <group position={[0, -0.06, 0.72]}>
        {/* Cream Muzzle Ellipsoid */}
        <mesh castShadow scale={[1.15, 0.9, 0.65]}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.creamBelly}
            roughness={0.25}
            clearcoat={0.7}
          />
        </mesh>

        {/* Chocolate Button Nose */}
        <mesh position={[0, 0.12, 0.28]} scale={[1.2, 0.85, 0.8]}>
          <sphereGeometry args={[0.13, 18, 18]} />
          <meshPhysicalMaterial
            color={LEGO_COLORS.bearDarkBrown}
            roughness={0.15}
            clearcoat={1.0}
          />
        </mesh>

        {/* Happy Smile Arc */}
        <mesh position={[0, -0.08, 0.28]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.13, 0.024, 12, 24, Math.PI * 0.85]} />
          <meshBasicMaterial color={LEGO_COLORS.bearDarkBrown} />
        </mesh>
      </group>

      {/* ── Big Sparkling Anime Eyes ── */}
      {/* Left Eye */}
      <group position={[-0.34, 0.16, 0.78]} rotation={[-0.05, -0.15, 0]}>
        {/* Eye Outline / Sclera */}
        <mesh scale={[1, 1.25, 1]}>
          <circleGeometry args={[0.18, 28]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
        </mesh>
        {/* Inner Warm Iris */}
        <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}>
          <circleGeometry args={[0.14, 24]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeIris} />
        </mesh>
        {/* Main Catchlight (Bright white sparkle) */}
        <mesh position={[-0.05, 0.07, 0.005]}>
          <circleGeometry args={[0.065, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Secondary Sub-catchlight */}
        <mesh position={[0.05, -0.05, 0.005]}>
          <circleGeometry args={[0.035, 14]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.34, 0.16, 0.78]} rotation={[-0.05, 0.15, 0]}>
        <mesh scale={[1, 1.25, 1]}>
          <circleGeometry args={[0.18, 28]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeBlack} />
        </mesh>
        <mesh position={[0, -0.02, 0.002]} scale={[0.9, 1.1, 1]}>
          <circleGeometry args={[0.14, 24]} />
          <meshBasicMaterial color={LEGO_COLORS.eyeIris} />
        </mesh>
        <mesh position={[-0.05, 0.07, 0.005]}>
          <circleGeometry args={[0.065, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.05, -0.05, 0.005]}>
          <circleGeometry args={[0.035, 14]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Rosy Cheeks */}
      <mesh position={[-0.52, -0.05, 0.68]} rotation={[-0.1, -0.4, 0]}>
        <circleGeometry args={[0.16, 20]} />
        <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0.52, -0.05, 0.68]} rotation={[-0.1, 0.4, 0]}>
        <circleGeometry args={[0.16, 20]} />
        <meshBasicMaterial color={LEGO_COLORS.cheeks} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ─── Glowing Heart Brick Accessory ──────────────────────────────────────────
function GlowingHeartBrick({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.25);
    s.bezierCurveTo(0, 0.35, -0.25, 0.55, -0.45, 0.55);
    s.bezierCurveTo(-0.75, 0.55, -0.75, 0.2, -0.75, 0.2);
    s.bezierCurveTo(-0.75, -0.05, -0.5, -0.3, 0, -0.65);
    s.bezierCurveTo(0.5, -0.3, 0.75, -0.05, 0.75, 0.2);
    s.bezierCurveTo(0.75, 0.2, 0.75, 0.55, 0.45, 0.55);
    s.bezierCurveTo(0.25, 0.55, 0, 0.35, 0, 0.25);
    return s;
  }, []);

  const geom = useMemo(() => {
    return new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
  }, [heartShape]);

  return (
    <group position={position} scale={[0.5, 0.5, 0.5]}>
      <mesh geometry={geom} castShadow>
        <meshPhysicalMaterial
          color={LEGO_COLORS.pinkHeart}
          emissive={LEGO_COLORS.pinkHeart}
          emissiveIntensity={0.5}
          roughness={0.08}
          transmission={0.8}
          thickness={0.8}
          clearcoat={1.0}
        />
      </mesh>
      {/* Miniature Lego Studs on Heart Top */}
      <LegoStud position={[-0.32, 0.6, 0.15]} color={LEGO_COLORS.pinkHeart} scale={[0.6, 0.6, 0.6]} />
      <LegoStud position={[0.32, 0.6, 0.15]} color={LEGO_COLORS.pinkHeart} scale={[0.6, 0.6, 0.6]} />
    </group>
  );
}

// ─── Complete Lego Minifigure Body & Limbs ──────────────────────────────────
function LegoFigureModel() {
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const figureGroupRef = useRef<THREE.Group>(null);

  const { mouse } = useThree();

  // Animation Loop: Head looks at mouse cursor + Right arm waves + breathing
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Head Tracking (Follows mouse cursor smoothly)
    if (headRef.current) {
      const targetRotY = mouse.x * 0.55;
      const targetRotX = -mouse.y * 0.35;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
    }

    // 2. Right Arm Waving Animation
    if (rightArmRef.current) {
      // Wave hand back and forth cheerfully
      const wave = Math.sin(t * 3.5) * 0.28;
      rightArmRef.current.rotation.z = -0.45 + wave;
      rightArmRef.current.rotation.x = 0.2 + Math.cos(t * 2.5) * 0.1;
    }

    // 3. Left Arm gentle breathing sway
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = 0.15 + Math.sin(t * 1.5) * 0.06;
    }

    // 4. Subtle Floating / breathing bounce
    if (figureGroupRef.current) {
      figureGroupRef.current.position.y = Math.sin(t * 2) * 0.06;
    }
  });

  return (
    <group ref={figureGroupRef} position={[0, -0.6, 0]}>
      {/* ── Head ── */}
      <LegoHead headRef={headRef as any} />

      {/* ── Torso ── */}
      <group position={[0, 0.18, 0]}>
        <LegoTorso />

        {/* ── Left Arm (Holding glowing heart brick) ── */}
        <group ref={leftArmRef} position={[-0.72, 0.55, 0]}>
          {/* Shoulder ball joint */}
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
          </mesh>
          {/* Arm angled forward */}
          <mesh position={[-0.15, -0.45, 0.22]} rotation={[0.45, 0, 0.2]}>
            <cylinderGeometry args={[0.16, 0.18, 0.75, 18]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} />
          </mesh>
          {/* Lego C-Hand holding glowing heart */}
          <LegoHand position={[-0.24, -0.85, 0.42]} rotation={[-0.3, 0.4, 0.5]} />
          <GlowingHeartBrick position={[-0.24, -0.75, 0.65]} />
        </group>

        {/* ── Right Arm (Waving cheerfully) ── */}
        <group ref={rightArmRef} position={[0.72, 0.55, 0]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshPhysicalMaterial color={LEGO_COLORS.shirtWhite} roughness={0.2} />
          </mesh>
          {/* Upper Arm raised */}
          <mesh position={[0.22, 0.25, 0.1]} rotation={[-0.3, 0, -0.55]}>
            <cylinderGeometry args={[0.16, 0.18, 0.75, 18]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.8} />
          </mesh>
          {/* Waving C-Hand */}
          <LegoHand position={[0.42, 0.62, 0.15]} rotation={[0.5, 0.4, -0.8]} />
        </group>
      </group>

      {/* ── Hips & Legs ── */}
      <group position={[0, -0.72, 0]}>
        {/* Hip Connector T-Bar */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[1.3, 0.24, 0.88]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 1.34, 24]} />
          <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
        </mesh>

        {/* Left Leg */}
        <group position={[-0.38, -0.55, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.1, 0.82]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} />
          </mesh>
          {/* Foot Step Cutout */}
          <mesh position={[0, -0.44, 0.22]} castShadow>
            <boxGeometry args={[0.56, 0.22, 0.4]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.38, -0.55, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.56, 1.1, 0.82]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearBrown} roughness={0.2} clearcoat={0.85} />
          </mesh>
          {/* Foot Step Cutout */}
          <mesh position={[0, -0.44, 0.22]} castShadow>
            <boxGeometry args={[0.56, 0.22, 0.4]} />
            <meshPhysicalMaterial color={LEGO_COLORS.bearDarkBrown} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* ── Circular Lego Baseplate (Display Pedestal) ── */}
      <group position={[0, -1.9, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[1.8, 1.9, 0.25, 36]} />
          <meshPhysicalMaterial color="#3E2723" roughness={0.4} clearcoat={0.6} />
        </mesh>
        {/* Baseplate Studs */}
        {[-1.0, -0.35, 0.35, 1.0].map((x, i) =>
          [-0.8, 0, 0.8].map((z, j) => (
            <LegoStud
              key={`${i}-${j}`}
              position={[x, 0.16, z]}
              color="#3E2723"
              scale={[0.7, 0.6, 0.7]}
            />
          ))
        )}
      </group>
    </group>
  );
}

// ─── Main Exported 3D Lego Canvas Component ─────────────────────────────────
export interface LegoCharacter3DProps {
  interactive?: boolean;     // Enable drag to orbit 360
  autoRotate?: boolean;      // Slowly spin turntable
  height?: number | string;  // Canvas height
  width?: number | string;   // Canvas width
  cameraZoom?: number;       // Camera distance
  sparkles?: boolean;        // Ambient magic sparkles
  className?: string;
  onClick?: () => void;
}

export function LegoCharacter3D({
  interactive = true,
  autoRotate = false,
  height = "100%",
  width = "100%",
  cameraZoom = 1.0,
  sparkles = true,
  className = "",
  onClick,
}: LegoCharacter3DProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
    if (onClick) onClick();
  };

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      style={{ width, height, touchAction: "none" }}
      onClick={handleClick}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 5.2 / cameraZoom], fov: 42 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ pointerEvents: interactive ? "auto" : "none" }}
      >
        {/* Studio Lighting Rig for Glossy Plastic Specular Highlights */}
        <ambientLight intensity={0.8} />
        {/* Key Light */}
        <directionalLight
          position={[4, 7, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={15}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        {/* Soft Warm Fill Light */}
        <directionalLight position={[-4, 3, 2]} intensity={0.9} color="#FFE6D5" />
        {/* Rim Backlight (Accentuates 3D edges & ears) */}
        <directionalLight position={[0, 4, -5]} intensity={1.5} color="#FFDFBA" />
        {/* Bottom ground bounce */}
        <directionalLight position={[0, -4, 2]} intensity={0.3} color="#FFFFFF" />

        {/* Ambient Magic Sparkles */}
        {sparkles && (
          <Sparkles
            count={28}
            scale={4}
            size={2.5}
            speed={0.6}
            color="#FFB3C6"
            opacity={0.7}
          />
        )}

        {/* Subtle Float Breathing Physics */}
        <Float speed={2.0} rotationIntensity={0.15} floatIntensity={0.25}>
          <group scale={clicked ? [1.12, 1.12, 1.12] : [1, 1, 1]}>
            <LegoFigureModel />
          </group>
        </Float>

        {/* Contact Shadow for Grounded Realism */}
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.45}
          scale={5.5}
          blur={1.8}
          far={4}
        />

        {/* 360 Degree Orbit Interaction */}
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={2.5}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 2.2}
            maxAzimuthAngle={Math.PI / 2.2}
          />
        )}
      </Canvas>
    </div>
  );
}

export default LegoCharacter3D;
