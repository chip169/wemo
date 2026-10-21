import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Orbit, X } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

const noiseChunk = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
`;

function SingularityBlackHole({ onClick }: { onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const isHovered = useRef(false);

  const instanceCount = 4500;

  // Geometry for accretion disk streaks
  const streakGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.01, 0.12, 2.2, 3);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);

  // Custom Shader Material with Relativistic Doppler shift and Keplerian rotation
  const diskMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0.15 },
        uCompression: { value: 1.0 },
        uIntensity: { value: 1.15 },
        uOrbitScale: { value: 1.0 },
      },
      vertexShader: `
        ${noiseChunk}
        uniform float uTime;
        uniform float uMorph;
        uniform float uCompression;
        uniform float uIntensity;
        uniform float uOrbitScale;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            float rOriginal = length(instPos.xz);
            float r = rOriginal * uCompression;
            float initialAngle = atan(instPos.z, instPos.x);
            float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
            float currentAngle = initialAngle + (uTime * orbitalVelocity);
            vec3 morphedWorldPos = vec3(cos(currentAngle) * r, instPos.y, sin(currentAngle) * r);
            float noise = snoise(vec3(morphedWorldPos.x * 0.08, morphedWorldPos.z * 0.08, uTime * 0.3));
            morphedWorldPos.y += noise * uMorph * 4.0;
            vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
            vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
            float doppler = dot(orbitDir, viewDir);
            vec3 hot = vec3(1.0, 0.98, 0.9);
            vec3 warm = vec3(1.0, 0.5, 0.1);
            vec3 cool = vec3(0.12, 0.4, 1.0);
            vec3 color = mix(cool, warm, smoothstep(42.0, 12.0, r));
            color = mix(color, hot, smoothstep(11.0, 4.0, r));
            vColor = color * (1.3 + doppler * 0.7) * uIntensity;
            vOpacity = (smoothstep(3.8, 5.5, r) * (1.0 - smoothstep(36.0, 46.0, r))) * 0.85;
            float deltaAngle = currentAngle - initialAngle;
            float c = cos(deltaAngle);
            float s = sin(deltaAngle);
            mat3 rotY = mat3(
                c, 0, s,
                0, 1, 0,
               -s, 0, c
            );
            vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
            vec3 rotatedLocalPos = rotY * localPos;
            gl_Position = projectionMatrix * viewMatrix * vec4(morphedWorldPos + rotatedLocalPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            gl_FragColor = vec4(vColor, vOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Lensing Aura Rim
  const auraMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uIntensity: { value: 1.0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
            float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.5);
            gl_FragColor = vec4(vec3(1.0, 0.6, 0.2) * rim * uIntensity * 4.5, 1.0);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Initialize instance matrices for the accretion disk
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < instanceCount; i++) {
      const r = 5.0 + Math.pow(Math.random(), 1.3) * 38;
      const angle = Math.random() * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * (7 / r),
        Math.sin(angle) * r
      );
      dummy.lookAt(
        dummy.position.x + Math.sin(angle),
        dummy.position.y,
        dummy.position.z - Math.cos(angle)
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [instanceCount]);

  useFrame((state, delta) => {
    if (diskMaterial) {
      const hoverBoost = isHovered.current ? 1.5 : 1.0;
      diskMaterial.uniforms.uTime.value += delta * 1.8 * hoverBoost;
      diskMaterial.uniforms.uIntensity.value = isHovered.current ? 1.4 : 1.15;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
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
      {/* Black Hole Event Horizon (Pure Black Shadow) */}
      <mesh>
        <sphereGeometry args={[4.0, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Relativistic Photon Sphere Halo */}
      <mesh>
        <sphereGeometry args={[4.28, 48, 48]} />
        <primitive object={auraMaterial} attach="material" />
      </mesh>

      {/* Accretion Disk Instanced Streaks */}
      <instancedMesh
        ref={meshRef}
        args={[streakGeo, diskMaterial, instanceCount]}
      />

      {/* Invisible Clickable Area */}
      <mesh visible={false}>
        <sphereGeometry args={[6.5, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

// ─── Orbiting Memory Photo Card in Cosmos ─────────────────────────────────────
function OrbitingSingularityPhoto({
  url,
  index,
  total,
  radius = 28,
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
    const angle = baseAngle + state.clock.elapsedTime * 0.12;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 2 + index) * 2.5;

    meshRef.current.position.set(x, y, z);
    meshRef.current.lookAt(0, 0, 0);
    meshRef.current.rotateY(Math.PI);
  });

  return (
    <group ref={meshRef}>
      {/* Sci-Fi Gold Frame */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[4.5, 4.5]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      {/* Inner Photo */}
      <mesh>
        <planeGeometry args={[4.2, 4.2]} />
        {texture ? (
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        ) : (
          <meshBasicMaterial color="#0A0E1A" />
        )}
      </mesh>
    </group>
  );
}

// ─── Scene Composition ───────────────────────────────────────────────────────
function SingularityScene({
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
      <color attach="background" args={["#030308"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={4.0} color="#FBBF24" distance={50} />

      <Stars radius={180} depth={80} count={6000} factor={4.5} saturation={0.7} fade speed={0.8} />

      <SingularityBlackHole onClick={onOpen} />

      {photos.map((url, i) => (
        <OrbitingSingularityPhoto key={i} url={url} index={i} total={photos.length} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3.5}
        rotateSpeed={0.5}
      />
    </>
  );
}

// ─── Singularity Message Overlay ─────────────────────────────────────────────
function SingularityMessageOverlay({
  gift,
  onClose,
}: {
  gift: any;
  onClose: () => void;
}) {
  const themeStyle = {
    textMain: "text-amber-100",
    textSub: "text-amber-300/80",
    cardBg: "bg-slate-950/85",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500",
    borderColor: "border-amber-500/40",
    glowColor: "rgba(245, 158, 11, 0.3)",
    heartColor: "#F59E0B",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 220 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl bg-gradient-to-b from-[#0B0F19] via-[#05070E] to-black border border-amber-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6"
        style={{
          boxShadow: "0 0 70px rgba(245, 158, 11, 0.3), inset 0 0 25px rgba(245, 158, 11, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900/80 border border-amber-500/40 flex items-center justify-center text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
          <Orbit className="w-4 h-4 text-amber-400" />
          Hố Đen Singularity 3D
        </div>

        {gift.recipientName && (
          <h2 className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight font-serif">
            Gửi {gift.recipientName} ✨
          </h2>
        )}

        {gift.title && (
          <p className="text-lg font-bold text-amber-400/90 tracking-wide">
            {gift.title}
          </p>
        )}

        <div className="bg-black/60 border border-amber-500/25 rounded-2xl p-5 leading-relaxed text-sm text-stone-200 whitespace-pre-line font-medium shadow-inner">
          {gift.message || "Tình yêu như lực hấp dẫn của hố đen kỳ vĩ, bẻ cong cả không gian và thời gian để đưa chúng ta về bên nhau..."}
        </div>

        {gift.hasVoice && gift.voiceUrl && (
          <AudioPlayerWidget src={gift.voiceUrl} themeStyle={themeStyle} />
        )}
        {gift.hasVideo && gift.videoUrl && (
          <VideoPlayerWidget src={gift.videoUrl} themeStyle={themeStyle} />
        )}

        {gift.senderName && (
          <div className="text-right pt-2 border-t border-amber-500/20">
            <span className="text-xs text-amber-400/80 font-bold">Thương mến từ: {gift.senderName} 🌌</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Click Hint ───────────────────────────────────────────────────────────────
function SingularityClickHint() {
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
      <p className="text-amber-200/70 text-xs tracking-wider">Chạm vào hố đen để mở thiệp</p>
    </motion.div>
  );
}

// ─── Main Component Export ───────────────────────────────────────────────────
export function SingularityCanvas3D({ gift }: { gift: any }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#030308]">
      <Canvas
        camera={{ position: [48, 22, 48], fov: 42 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SingularityScene gift={gift} opened={opened} onOpen={() => setOpened(true)} />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {!opened && <SingularityClickHint key="hint" />}
          {opened && (
            <SingularityMessageOverlay
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
            className="flex items-center gap-2 bg-black/60 border border-amber-500/40 rounded-full px-4 py-1.5 backdrop-blur-md"
          >
            <Orbit className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-200/90 text-xs tracking-widest uppercase font-bold">Hố Đen Singularity 3D</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
