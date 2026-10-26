import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

// ─── Cute Pink & Rose Gold LEGO Butler Colors ────────────────────────────────
const BUTLER_COLORS = {
  suitPink: "#F472B6",         // Lovely sweet candy rose pink (Tuxedo & Top Hat)
  suitPinkDark: "#DB2777",     // Deep rose satin accents & hat ribbon
  suitLapel: "#FCE7F3",        // Delicate pastel baby pink lapels & trims
  shirtWhite: "#FFFFFF",       // Crisp white butler dress shirt
  bowTieRed: "#E11D48",        // Radiant ruby rose bow tie
  robotSilver: "#FDF2F8",      // Pearlescent blush metallic silver head & arms
  robotDarkGray: "#9D174D",    // Deep raspberry mechanical joints
  visorScreen: "#190812",      // Dark obsidian plum visor panel
  neonPink: "#FF2E93",         // Glowing neon pink LED eyes & smile
  neonPinkGlow: "#F472B6",     // Ambient pink visor glow
  earPink: "#E11D48",          // High-tech ruby pink earhub studs
  goldChain: "#F59E0B",        // Shiny gold pocket watch chain
  bootPink: "#9D174D",         // Deep raspberry pink butler boots
};

// ─── Authentic LEGO Stud with Hollow Center Rim ──────────────────────────────
function LegoStud({ position, scale = [1, 1, 1], color = BUTLER_COLORS.suitPink }: {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 28]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>
      {/* Inner recessed circle rim */}
      <mesh position={[0, 0.091, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.18, 24]} />
        <meshBasicMaterial color="#701A75" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── Authentic LEGO Minifigure C-Claw Hand ──────────────────────────────────
function LegoHand({ position, rotation = [0, 0, 0], color = BUTLER_COLORS.robotSilver }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wrist cylinder peg */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.22, 18]} />
        <meshPhysicalMaterial color={color} roughness={0.2} metalness={0.25} clearcoat={0.9} />
      </mesh>
      {/* Curved C-Claw */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.075, 16, 28, Math.PI * 1.42]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.18}
          metalness={0.25}
          clearcoat={0.95}
        />
      </mesh>
    </group>
  );
}

// ─── Elegant Pink Top Hat (Mũ chóp cao hồng ngọt ngào với LEGO Studs) ───────
function LegoTopHat() {
  return (
    <group position={[0, 0.88, 0]}>
      {/* Wide Hat Brim Plate */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.92, 0.94, 0.1, 32]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.suitPink}
          roughness={0.14}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Ring of Studs along the Brim Rim (Authentic LEGO build) */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r = 0.76;
        return (
          <LegoStud
            key={`brim-${i}`}
            position={[Math.cos(rad) * r, 0.09, Math.sin(rad) * r]}
            scale={[0.42, 0.4, 0.42]}
            color={BUTLER_COLORS.suitPink}
          />
        );
      })}

      {/* Deep Rose Hat Ribbon Band */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.67, 0.65, 0.14, 32]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.suitPinkDark}
          roughness={0.18}
          clearcoat={0.8}
        />
      </mesh>

      {/* Tall Cylinder Crown */}
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.66, 0.62, 1.04, 32]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.suitPink}
          roughness={0.14}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Top Cap of the Crown */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.67, 0.66, 0.06, 32]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.suitPink}
          roughness={0.14}
          clearcoat={1.0}
        />
      </mesh>

      {/* Top Studs on the Hat Crown (Classic LEGO Top) */}
      <LegoStud position={[0, 1.16, 0]} scale={[0.82, 0.75, 0.82]} color={BUTLER_COLORS.suitPink} />
      {[-0.32, 0.32].map((x, i) =>
        [-0.32, 0.32].map((z, j) => (
          <LegoStud
            key={`top-${i}-${j}`}
            position={[x, 1.16, z]}
            scale={[0.55, 0.5, 0.55]}
            color={BUTLER_COLORS.suitPink}
          />
        ))
      )}
    </group>
  );
}

// ─── Robot Butler Head with Glowing Neon Pink Visor & Ear Hubs ──────────────
function LegoRobotHead({ eyeState = "normal" }: { eyeState: "normal" | "blink" | "happy" }) {
  return (
    <group position={[0, 0.92, 0]}>
      {/* Pearlescent Blush Main Head Cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.74, 0.74, 0.94, 32]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.robotSilver}
          metalness={0.2}
          roughness={0.2}
          clearcoat={0.95}
        />
      </mesh>

      {/* Head Top Smooth Dome Joint */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <sphereGeometry args={[0.735, 32, 16]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.robotSilver}
          metalness={0.2}
          roughness={0.2}
          clearcoat={0.95}
        />
      </mesh>

      {/* Pink Top Hat sitting proudly on the head */}
      <LegoTopHat />

      {/* Front Glossy Obsidian Plum Visor Screen Panel */}
      <mesh position={[0, 0.05, 0.68]} castShadow>
        <boxGeometry args={[0.96, 0.48, 0.14]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.visorScreen}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* ── Glowing Neon Pink Visor Eyes ── */}
      {eyeState === "happy" ? (
        // Happy smiling glowing arches (^ ^)
        <>
          <group position={[-0.26, 0.08, 0.76]} rotation={[0, 0, Math.PI]}>
            <mesh>
              <torusGeometry args={[0.085, 0.025, 12, 24, Math.PI]} />
              <meshStandardMaterial
                color={BUTLER_COLORS.neonPink}
                emissive={BUTLER_COLORS.neonPink}
                emissiveIntensity={4.0}
                roughness={0.1}
              />
            </mesh>
          </group>
          <group position={[0.26, 0.08, 0.76]} rotation={[0, 0, Math.PI]}>
            <mesh>
              <torusGeometry args={[0.085, 0.025, 12, 24, Math.PI]} />
              <meshStandardMaterial
                color={BUTLER_COLORS.neonPink}
                emissive={BUTLER_COLORS.neonPink}
                emissiveIntensity={4.0}
                roughness={0.1}
              />
            </mesh>
          </group>
        </>
      ) : eyeState === "blink" ? (
        // Sleek horizontal glowing slits (- -)
        <>
          <mesh position={[-0.26, 0.06, 0.76]}>
            <boxGeometry args={[0.24, 0.035, 0.02]} />
            <meshStandardMaterial
              color={BUTLER_COLORS.neonPink}
              emissive={BUTLER_COLORS.neonPink}
              emissiveIntensity={3.8}
            />
          </mesh>
          <mesh position={[0.26, 0.06, 0.76]}>
            <boxGeometry args={[0.24, 0.035, 0.02]} />
            <meshStandardMaterial
              color={BUTLER_COLORS.neonPink}
              emissive={BUTLER_COLORS.neonPink}
              emissiveIntensity={3.8}
            />
          </mesh>
        </>
      ) : (
        // Iconic bright glowing rounded eyes
        <>
          <group position={[-0.26, 0.06, 0.76]}>
            <mesh>
              <boxGeometry args={[0.24, 0.22, 0.02]} />
              <meshStandardMaterial
                color={BUTLER_COLORS.neonPink}
                emissive={BUTLER_COLORS.neonPink}
                emissiveIntensity={3.8}
                roughness={0.1}
              />
            </mesh>
            {/* Inner pupil mesh texture */}
            <mesh position={[0, 0, 0.012]}>
              <ringGeometry args={[0.03, 0.07, 16]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} />
            </mesh>
          </group>

          <group position={[0.26, 0.06, 0.76]}>
            <mesh>
              <boxGeometry args={[0.24, 0.22, 0.02]} />
              <meshStandardMaterial
                color={BUTLER_COLORS.neonPink}
                emissive={BUTLER_COLORS.neonPink}
                emissiveIntensity={3.8}
                roughness={0.1}
              />
            </mesh>
            {/* Inner pupil mesh texture */}
            <mesh position={[0, 0, 0.012]}>
              <ringGeometry args={[0.03, 0.07, 16]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} />
            </mesh>
          </group>
        </>
      )}

      {/* Friendly Glowing Neon Pink Robot Smile Slit */}
      <mesh position={[0, -0.12, 0.76]}>
        <boxGeometry args={[0.34, 0.04, 0.02]} />
        <meshStandardMaterial
          color={BUTLER_COLORS.neonPink}
          emissive={BUTLER_COLORS.neonPink}
          emissiveIntensity={3.2}
        />
      </mesh>

      {/* Left Robotic Ear Audio Hub */}
      <group position={[-0.76, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.robotSilver} metalness={0.3} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.earPink} clearcoat={1.0} />
        </mesh>
      </group>

      {/* Right Robotic Ear Audio Hub */}
      <group position={[0.76, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.robotSilver} metalness={0.3} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.earPink} clearcoat={1.0} />
        </mesh>
      </group>

      {/* Neck Peg */}
      <mesh position={[0, -0.56, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.2, 24]} />
        <meshPhysicalMaterial color={BUTLER_COLORS.robotDarkGray} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Authentic LEGO Pink Tuxedo Butler Torso with Red Bow Tie ────────────────
function LegoButlerTorso() {
  const torsoGeom = useMemo(() => {
    const shape = new THREE.Shape();
    const topW = 0.92;
    const botW = 1.22;
    const h = 1.48;

    shape.moveTo(-botW / 2, -h / 2);
    shape.lineTo(botW / 2, -h / 2);
    shape.lineTo(topW / 2, h / 2);
    shape.lineTo(-topW / 2, h / 2);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    g.center();
    return g;
  }, []);

  return (
    <group position={[0, 0.05, 0]}>
      {/* Pink Tuxedo Jacket Shell */}
      <mesh geometry={torsoGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={BUTLER_COLORS.suitPink}
          roughness={0.14}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Crisp White Collared Shirt Insert (V-Shape Center) */}
      <mesh position={[0, 0.12, 0.44]}>
        <planeGeometry args={[0.44, 0.88]} />
        <meshPhysicalMaterial
          color={BUTLER_COLORS.shirtWhite}
          roughness={0.2}
          clearcoat={0.6}
        />
      </mesh>

      {/* Left Pastel Pink Satin Lapel */}
      <mesh position={[-0.32, 0.06, 0.45]} rotation={[0, 0, -0.16]}>
        <boxGeometry args={[0.22, 1.05, 0.02]} />
        <meshPhysicalMaterial color={BUTLER_COLORS.suitLapel} roughness={0.12} clearcoat={1.0} />
      </mesh>

      {/* Right Pastel Pink Satin Lapel */}
      <mesh position={[0.32, 0.06, 0.45]} rotation={[0, 0, 0.16]}>
        <boxGeometry args={[0.22, 1.05, 0.02]} />
        <meshPhysicalMaterial color={BUTLER_COLORS.suitLapel} roughness={0.12} clearcoat={1.0} />
      </mesh>

      {/* ── Vibrant Ruby Red Bow Tie (Nơ đỏ nổi bật của Butler) ── */}
      <group position={[0, 0.46, 0.48]}>
        {/* Center knot stud */}
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.12, 0.08]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.bowTieRed} roughness={0.18} clearcoat={0.9} />
        </mesh>
        {/* Left wing */}
        <mesh position={[-0.14, 0, 0]} rotation={[0, 0, -0.18]} castShadow>
          <coneGeometry args={[0.13, 0.22, 4]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.bowTieRed} roughness={0.18} clearcoat={0.9} />
        </mesh>
        {/* Right wing */}
        <mesh position={[0.14, 0, 0]} rotation={[0, 0, 0.18]} castShadow>
          <coneGeometry args={[0.13, 0.22, 4]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.bowTieRed} roughness={0.18} clearcoat={0.9} />
        </mesh>
      </group>

      {/* Tiny Pink Tuxedo Buttons down the white shirt */}
      <mesh position={[0, 0.18, 0.455]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color={BUTLER_COLORS.suitPinkDark} />
      </mesh>
      <mesh position={[0, 0.02, 0.455]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color={BUTLER_COLORS.suitPinkDark} />
      </mesh>
      <mesh position={[0, -0.14, 0.455]}>
        <circleGeometry args={[0.026, 16]} />
        <meshBasicMaterial color={BUTLER_COLORS.suitPinkDark} />
      </mesh>

      {/* White Folded Pocket Square (Khăn cài túi ngực) */}
      <group position={[0.34, 0.26, 0.455]} rotation={[0, 0, -0.15]}>
        <mesh>
          <planeGeometry args={[0.16, 0.04]} />
          <meshBasicMaterial color={BUTLER_COLORS.shirtWhite} />
        </mesh>
        {/* Triangular handkerchief peaks */}
        <mesh position={[0, 0.035, 0]}>
          <coneGeometry args={[0.04, 0.06, 3]} />
          <meshBasicMaterial color={BUTLER_COLORS.shirtWhite} />
        </mesh>
      </group>

      {/* Elegant Gold Chain / Watch Accent */}
      <mesh position={[-0.18, -0.22, 0.455]} rotation={[0, 0, 0.35]}>
        <torusGeometry args={[0.1, 0.014, 8, 16, Math.PI * 0.9]} />
        <meshStandardMaterial color={BUTLER_COLORS.goldChain} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── Main LEGO Robot Butler Minifigure Model ─────────────────────────────────
function LegoRobotButlerModel({ isHovered, isClicked }: { isHovered: boolean; isClicked: boolean }) {
  const figureGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const { pointer } = useThree();

  // Natural Eye-State Machine (Normal -> Periodic Blinking -> Happy on Hover)
  const [eyeState, setEyeState] = useState<"normal" | "blink" | "happy">("normal");

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // ── 1. Autonomous Blinking Logic ─────────────────────────────────────────
    if (isHovered) {
      if (eyeState !== "happy") setEyeState("happy");
    } else {
      const blinkCycle = (t % 3.6);
      if (blinkCycle < 0.16) {
        if (eyeState !== "blink") setEyeState("blink");
      } else {
        if (eyeState !== "normal") setEyeState("normal");
      }
    }

    // ── 2. Head Mouse-Tracking & Inquisitive Tilts ────────────────────────────
    if (headRef.current) {
      const targetRotY = pointer.x * 0.45;
      const targetRotX = -pointer.y * 0.28 + Math.sin(t * 1.4) * 0.03;
      const targetTiltZ = isHovered ? -0.1 : Math.sin(t * 0.9) * 0.05;

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetTiltZ, 0.08);
    }

    // ── 3. Autonomous Butler Animation Modes ──────────────────────────────────
    const animPhase = t % 15;
    let mode: "idle" | "wave" | "walk" | "bow" = "idle";

    if (isClicked) {
      mode = "bow";
    } else if (isHovered) {
      mode = "wave";
    } else if (animPhase > 4 && animPhase < 8.5) {
      mode = "wave";
    } else if (animPhase >= 11 && animPhase <= 14) {
      mode = "walk";
    }

    // ── 4. Natural Body Float & Polite Butler Bow ────────────────────────────
    if (figureGroupRef.current) {
      if (mode === "bow") {
        figureGroupRef.current.position.y = -0.22;
        figureGroupRef.current.rotation.x = 0.2; // Polite respectful bow
        figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, 0, 0.1);
      } else if (mode === "walk") {
        figureGroupRef.current.position.y = -0.16 + Math.abs(Math.sin(t * 5)) * 0.04;
        figureGroupRef.current.rotation.y = Math.sin(t * 2.5) * 0.06;
        figureGroupRef.current.rotation.x = THREE.MathUtils.lerp(figureGroupRef.current.rotation.x, 0, 0.1);
      } else {
        // Natural gentle idle breathing float
        figureGroupRef.current.position.y = -0.16 + Math.sin(t * 2.2) * 0.03;
        figureGroupRef.current.rotation.y = THREE.MathUtils.lerp(figureGroupRef.current.rotation.y, 0, 0.08);
        figureGroupRef.current.rotation.x = THREE.MathUtils.lerp(figureGroupRef.current.rotation.x, 0, 0.08);
      }
    }

    // ── 5. Right Arm (Welcoming Butler Wave & Presentation) ──────────────────
    if (rightArmRef.current) {
      if (mode === "bow") {
        rightArmRef.current.rotation.z = -0.25;
        rightArmRef.current.rotation.x = 0.4;
      } else if (mode === "walk") {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.1);
        rightArmRef.current.rotation.x = Math.sin(t * 5) * 0.38;
      } else if (mode === "wave") {
        const waveSpeed = isHovered ? 7.2 : 3.8;
        const waveAmp = isHovered ? 0.38 : 0.25;
        const wave = Math.sin(t * waveSpeed) * waveAmp;
        rightArmRef.current.rotation.z = -0.42 + wave;
        rightArmRef.current.rotation.x = 0.15 + Math.cos(t * 2.5) * 0.08;
      } else {
        // Polite rest
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.16, 0.08);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.08, 0.08);
      }
    }

    // ── 6. Left Arm (Hospitable Butler Welcome Pose) ─────────────────────────
    if (leftArmRef.current) {
      if (mode === "bow") {
        leftArmRef.current.rotation.x = 0.4;
        leftArmRef.current.rotation.z = 0.25;
      } else if (mode === "walk") {
        leftArmRef.current.rotation.x = 0.12 - Math.sin(t * 5) * 0.3;
      } else {
        // Welcoming outstretched butler gesture
        leftArmRef.current.rotation.x = 0.18 + Math.sin(t * 1.5) * 0.04;
        leftArmRef.current.rotation.z = 0.18;
      }
    }

    // ── 7. Legs (Autonomous stepping) ───────────────────────────────────────
    if (leftLegRef.current && rightLegRef.current) {
      if (mode === "walk") {
        leftLegRef.current.rotation.x = Math.sin(t * 5) * 0.36;
        rightLegRef.current.rotation.x = -Math.sin(t * 5) * 0.36;
      } else {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  return (
    <group ref={figureGroupRef} position={[0, -0.16, 0]}>
      {/* ── 1. Robot Butler Head & Top Hat ── */}
      <group ref={headRef}>
        <LegoRobotHead eyeState={eyeState} />
      </group>

      {/* ── 2. Tuxedo Butler Torso ── */}
      <group>
        <LegoButlerTorso />

        {/* ── Left Arm (Welcoming Butler Gesture) ── */}
        <group ref={leftArmRef} position={[-0.62, 0.52, 0]}>
          {/* Shoulder ball joint */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshPhysicalMaterial color={BUTLER_COLORS.suitPink} roughness={0.2} />
          </mesh>
          {/* Upper Arm Capsule */}
          <mesh position={[0.08, -0.22, 0.12]} rotation={[-0.32, 0.14, -0.22]} castShadow>
            <capsuleGeometry args={[0.13, 0.42, 12, 18]} />
            <meshPhysicalMaterial
              color={BUTLER_COLORS.robotSilver}
              metalness={0.25}
              roughness={0.2}
              clearcoat={0.9}
            />
          </mesh>
          {/* Pearlescent C-Hand in hospitable welcoming pose */}
          <LegoHand position={[0.16, -0.46, 0.24]} rotation={[-0.3, 0.4, 0.2]} />
        </group>

        {/* ── Right Arm (Polite Waving Hand) ── */}
        <group ref={rightArmRef} position={[0.62, 0.52, 0]}>
          {/* Shoulder ball joint */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshPhysicalMaterial color={BUTLER_COLORS.suitPink} roughness={0.2} />
          </mesh>
          {/* Upper Arm Capsule */}
          <mesh position={[0.15, 0.2, 0.06]} rotation={[-0.2, 0, -0.45]} castShadow>
            <capsuleGeometry args={[0.13, 0.46, 12, 18]} />
            <meshPhysicalMaterial
              color={BUTLER_COLORS.robotSilver}
              metalness={0.25}
              roughness={0.2}
              clearcoat={0.9}
            />
          </mesh>
          {/* Waving Pearlescent C-Hand */}
          <LegoHand position={[0.3, 0.48, 0.08]} rotation={[0.4, 0.25, -0.65]} />
        </group>
      </group>

      {/* ── 3. Tuxedo Hips & Robotic Butler Legs ── */}
      <group position={[0, -0.7, 0]}>
        {/* Hip T-Bar in Pink */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[1.22, 0.2, 0.78]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.suitPink} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 1.26, 24]} />
          <meshPhysicalMaterial color={BUTLER_COLORS.robotDarkGray} roughness={0.3} />
        </mesh>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.36, -0.5, 0]}>
          {/* White / Blush Thigh */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.98, 0.74]} />
            <meshPhysicalMaterial
              color={BUTLER_COLORS.shirtWhite}
              roughness={0.16}
              clearcoat={0.9}
            />
          </mesh>
          {/* Deep Raspberry Pink Foot Step */}
          <mesh position={[0, -0.4, 0.2]}>
            <boxGeometry args={[0.52, 0.18, 0.36]} />
            <meshPhysicalMaterial color={BUTLER_COLORS.bootPink} roughness={0.2} />
          </mesh>
          {/* Side Leg Hole for authentic Lego look */}
          <mesh position={[-0.27, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 18]} />
            <meshBasicMaterial color={BUTLER_COLORS.robotDarkGray} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.36, -0.5, 0]}>
          {/* White / Blush Thigh */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.98, 0.74]} />
            <meshPhysicalMaterial
              color={BUTLER_COLORS.shirtWhite}
              roughness={0.16}
              clearcoat={0.9}
            />
          </mesh>
          {/* Deep Raspberry Pink Foot Step */}
          <mesh position={[0, -0.4, 0.2]}>
            <boxGeometry args={[0.52, 0.18, 0.36]} />
            <meshPhysicalMaterial color={BUTLER_COLORS.bootPink} roughness={0.2} />
          </mesh>
          {/* Side Leg Hole */}
          <mesh position={[0.27, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 18]} />
            <meshBasicMaterial color={BUTLER_COLORS.robotDarkGray} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Main Exported Floating LEGO AI Butler Mascot Component ──────────────────
export interface WalkingBot3DProps {
  onOpenChat?: () => void;
  className?: string;
}

export function WalkingBot3D({ onOpenChat, className = "" }: WalkingBot3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      if (onOpenChat) onOpenChat();
    }, 450);
  };

  return (
    <div className={`fixed bottom-3 right-3 z-50 select-none ${className}`}>
      {/* ── 3D LEGO Mascot Canvas (Compact, Scaled down, No text clutter) ── */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        title="Nhấn để trò chuyện cùng Quản Gia LEGO WEMO 🎀🤖✨"
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className="relative"
          style={{
            width: 110,
            height: 145,
            background: "transparent",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 0.38, 6.4], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.96} />
            {/* Key Studio Light */}
            <directionalLight position={[4, 8, 5]} intensity={2.2} castShadow />
            {/* Soft Warm Rose Studio Fill Light */}
            <directionalLight position={[-4, 3, 3]} intensity={1.2} color="#FCE7F3" />
            {/* Rim Backlight highlighting the Top Hat & Shoulders */}
            <directionalLight position={[0, 5, -5]} intensity={1.8} color="#FDA4AF" />
            {/* Soft Neon Pink Visor Glow */}
            <pointLight position={[0, 0.95, 1.1]} intensity={1.6} color={BUTLER_COLORS.neonPink} distance={2.5} />

            {/* Ambient Cute Sparkles */}
            <Sparkles count={16} scale={3.2} size={2.0} speed={0.45} color="#F472B6" opacity={0.7} />

            <Float speed={1.8} rotationIntensity={0.04} floatIntensity={0.08}>
              {/* Scaled down comfortably so top hat and boots are 100% visible */}
              <group scale={[0.74, 0.74, 0.74]}>
                <LegoRobotButlerModel isHovered={isHovered} isClicked={isClicked} />
              </group>
            </Float>

            {/* Ground Contact Shadow */}
            <ContactShadows position={[0, -1.75, 0]} opacity={0.3} scale={2.4} blur={1.5} far={2.2} />
          </Canvas>

          {/* Online green indicator dot */}
          <span className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

export default WalkingBot3D;
