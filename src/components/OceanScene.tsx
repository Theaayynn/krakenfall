"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAudioStore } from "@/store/audio-store";

const waveVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float freq1 = 0.35;
    float freq2 = 0.7;
    float elevation =
      sin(pos.x * freq1 + uTime * 0.6) * 0.35 +
      sin(pos.y * freq2 + uTime * 0.4) * 0.2 +
      sin((pos.x + pos.y) * 0.5 + uTime * 0.8) * 0.15;
    pos.z += elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waveFragmentShader = `
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform float uFlash;
  varying float vElevation;

  void main() {
    float mixFactor = smoothstep(-0.3, 0.5, vElevation);
    vec3 color = mix(uDeepColor, uShallowColor, mixFactor);
    color += uFlash * vec3(0.55, 0.6, 0.7);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function OceanMesh({ flashRef }: { flashRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color("#04121A") },
      uShallowColor: { value: new THREE.Color("#1F6E6A") },
      uFlash: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uFlash.value = THREE.MathUtils.lerp(uniforms.uFlash.value, flashRef.current, 0.15);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[60, 60, 120, 120]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
}

function DriftingFog() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.05) * 3;
    }
  });
  const fogSprites = useMemo(() => Array.from({ length: 6 }), []);
  return (
    <group ref={groupRef}>
      {fogSprites.map((_, i) => (
        <mesh key={i} position={[(i - 3) * 8, -0.3 + Math.sin(i) * 0.4, -10 - i * 2]}>
          <planeGeometry args={[18, 6]} />
          <meshBasicMaterial color="#0A1420" transparent opacity={0.18} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingEmbers() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 180;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 12 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.015;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      posAttr.setY(i, y + Math.sin(t * 0.4 + i) * 0.001);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#E4C77A" size={0.05} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function LightningController({ onFlash }: { onFlash: () => void }) {
  const flashLightRef = useRef<THREE.PointLight>(null);
  const nextStrike = useRef(4 + Math.random() * 6);
  const elapsedSinceStart = useRef(0);

  useFrame((_, delta) => {
    elapsedSinceStart.current += delta;
    if (elapsedSinceStart.current >= nextStrike.current) {
      elapsedSinceStart.current = 0;
      nextStrike.current = 5 + Math.random() * 9;
      onFlash();
      if (flashLightRef.current) {
        flashLightRef.current.intensity = 6;
      }
    }
    if (flashLightRef.current && flashLightRef.current.intensity > 0) {
      flashLightRef.current.intensity *= 0.85;
    }
  });

  return <pointLight ref={flashLightRef} position={[0, 15, -10]} color="#AFCBEA" intensity={0} distance={60} />;
}

function CameraParallax() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.2 - target.current.y, 0.03);
    camera.lookAt(0, 0, -10);
  });

  return null;
}

export default function OceanScene() {
  const flashRef = useRef(0);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const playThunder = useAudioStore((s) => s.playThunder);

  function triggerFlash() {
    flashRef.current = 1;
    setFlashOpacity(0.9);
    playThunder();
    setTimeout(() => (flashRef.current = 0), 180);
    setTimeout(() => setFlashOpacity(0), 220);
  }

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 1.2, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <color attach="background" args={["#04060A"]} />
        <fog attach="fog" args={["#050A10", 8, 42]} />
        <ambientLight intensity={0.4} color="#2A4A55" />
        <directionalLight position={[5, 8, 2]} intensity={0.3} color="#5A7A85" />
        <OceanMesh flashRef={flashRef} />
        <DriftingFog />
        <FloatingEmbers />
        <LightningController onFlash={triggerFlash} />
        <CameraParallax />
      </Canvas>
      {/* Screen-space flash overlay for a crisper lightning hit */}
      <div
        className="pointer-events-none absolute inset-0 bg-white transition-opacity duration-100"
        style={{ opacity: flashOpacity * 0.35 }}
      />
    </div>
  );
}
