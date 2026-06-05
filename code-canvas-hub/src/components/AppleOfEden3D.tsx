import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh, Group } from "three";

/**
 * Apple of Eden — a glowing artifact with orbiting golden ring & inner core.
 * Drop-in 3D piece for the landing page.
 */
function Core() {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.4;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.6}>
      <Sphere ref={ref} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#d4af37"
          emissive="#ff8a00"
          emissiveIntensity={0.85}
          metalness={1}
          roughness={0.15}
        />
      </Sphere>
      {/* Outer glass shell */}
      <Sphere args={[1.06, 48, 48]}>
        <meshBasicMaterial color="#ffd373" transparent opacity={0.12} wireframe />
      </Sphere>
    </Float>
  );
}

function Orbits() {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={g}>
      <Torus args={[1.7, 0.012, 16, 120]} rotation={[Math.PI / 2.4, 0, 0]}>
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.7} metalness={1} roughness={0.2} />
      </Torus>
      <Torus args={[2.0, 0.012, 16, 120]} rotation={[-Math.PI / 3, 0.4, 0]}>
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} metalness={0.8} roughness={0.3} />
      </Torus>
      <Torus args={[2.3, 0.008, 16, 120]} rotation={[0.6, -0.8, 0]}>
        <meshStandardMaterial color="#ffd373" emissive="#ffd373" emissiveIntensity={0.4} metalness={1} roughness={0.25} />
      </Torus>
    </group>
  );
}

export function AppleOfEden3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 3]} intensity={2.4} color="#ffae42" />
      <pointLight position={[-3, -1, 2]} intensity={1.4} color="#dc2626" />
      <Suspense fallback={null}>
        <Stars radius={20} depth={30} count={300} factor={2} fade speed={0.6} />
        <Core />
        <Orbits />
      </Suspense>
    </Canvas>
  );
}
