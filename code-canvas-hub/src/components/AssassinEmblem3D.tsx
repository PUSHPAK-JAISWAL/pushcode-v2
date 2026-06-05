import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Torus } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function SpinningCore() {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.6;
    ref.current.rotation.x += dt * 0.25;
  });
  return (
    <Float speed={2.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[1, 0]}>
        <meshStandardMaterial
          color="#1a0507"
          emissive="#dc2626"
          emissiveIntensity={0.55}
          metalness={0.85}
          roughness={0.25}
          wireframe={false}
        />
      </Icosahedron>
      <Icosahedron args={[1.02, 0]}>
        <meshBasicMaterial color="#dc2626" wireframe />
      </Icosahedron>
    </Float>
  );
}

function GoldRing({ tilt = 0, speed = 0.3, radius = 1.8 }: { tilt?: number; speed?: number; radius?: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <Torus ref={ref} args={[radius, 0.012, 16, 120]} rotation={[tilt, 0, 0]}>
      <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.6} metalness={1} roughness={0.2} />
    </Torus>
  );
}

export function AssassinEmblem3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 3]} intensity={2.2} color="#dc2626" />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color="#d4af37" />
      <Suspense fallback={null}>
        <SpinningCore />
        <GoldRing tilt={0.3} speed={0.4} radius={1.7} />
        <GoldRing tilt={-0.6} speed={-0.3} radius={2.0} />
        <GoldRing tilt={1.2} speed={0.2} radius={2.3} />
      </Suspense>
    </Canvas>
  );
}
