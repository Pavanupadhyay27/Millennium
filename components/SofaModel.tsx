"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface SofaModelProps {
  url: string;
  onLoaded: () => void;
  isRevealed: boolean;
  mousePointer: { x: number; y: number };
}

export default function SofaModel({
  url,
  onLoaded,
  isRevealed,
  mousePointer,
}: SofaModelProps) {
  const outerGroupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);

  // Notify parent on mount/load
  React.useEffect(() => {
    // Small delay to simulate model processing and trigger reveal
    const timer = setTimeout(() => {
      onLoaded();
    }, 200);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  // Load the GLB file safely. If it fails, the Error Boundary in the parent Canvas will catch it.
  // Blender Export settings expected:
  // - Coordinates: Y-up
  // - Transforms: Applied before export (position [0,0,0], rotation [0,0,0], scale [1,1,1])
  // - Compression: Draco enabled (under 5MB recommended)
  // - Textures: Baked diffuse/normal maps for optimal performance
  const { scene } = useGLTF(url);

  useFrame((_, delta) => {
    if (!isRevealed) return;

    // 1. Slow Y auto-rotation on the outer group (~0.05 rad/s)
    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y += 0.03 * delta;
    }

    // 2. Subtle mouse parallax tilt on the inner group (max ~6 degrees / 0.1 rad)
    if (innerGroupRef.current) {
      const targetTiltX = mousePointer.y * (6 * Math.PI / 180);
      const targetTiltY = mousePointer.x * (6 * Math.PI / 180);

      innerGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        innerGroupRef.current.rotation.x,
        targetTiltX,
        delta * 3
      );
      innerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        innerGroupRef.current.rotation.y,
        targetTiltY,
        delta * 3
      );
    }
  });

  return (
    <group ref={outerGroupRef} position={[0, -0.4, 0]}>
      <group ref={innerGroupRef}>
        <primitive
          object={scene}
          scale={[1.1, 1.1, 1.1]}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  );
}

// Fallback Model Component in case the GLB fails to load or is not found.
// This renders a beautiful, stylized mid-century modern armchair.
export function StylizedArmchairFallback({
  isRevealed,
  mousePointer,
}: {
  isRevealed: boolean;
  mousePointer: { x: number; y: number };
}) {
  const outerGroupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!isRevealed) return;

    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y += 0.03 * delta;
    }

    if (innerGroupRef.current) {
      const targetTiltX = mousePointer.y * (6 * Math.PI / 180);
      const targetTiltY = mousePointer.x * (6 * Math.PI / 180);

      innerGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        innerGroupRef.current.rotation.x,
        targetTiltX,
        delta * 3
      );
      innerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        innerGroupRef.current.rotation.y,
        targetTiltY,
        delta * 3
      );
    }
  });

  return (
    <group ref={outerGroupRef} position={[0, -0.3, 0]}>
      <group ref={innerGroupRef}>
        {/* Main Seat Cushion */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.3, 1.0]} />
          <meshStandardMaterial
            color="#2F6F62"
            roughness={0.75}
            metalness={0.05}
          />
        </mesh>

        {/* Backrest */}
        <mesh position={[0, 0.45, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.6, 0.25]} />
          <meshStandardMaterial
            color="#2F6F62"
            roughness={0.75}
            metalness={0.05}
          />
        </mesh>

        {/* Left Armrest */}
        <mesh position={[-0.65, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.5, 0.95]} />
          <meshStandardMaterial
            color="#1F1B16"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Right Armrest */}
        <mesh position={[0.65, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.5, 0.95]} />
          <meshStandardMaterial
            color="#1F1B16"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Wooden Legs (4 corner legs) */}
        <mesh position={[-0.5, -0.3, 0.35]} rotation={[0.1, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.02, 0.4]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.5} />
        </mesh>
        <mesh position={[0.5, -0.3, 0.35]} rotation={[0.1, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.02, 0.4]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.5} />
        </mesh>
        <mesh position={[-0.5, -0.3, -0.35]} rotation={[-0.1, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.02, 0.4]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.5} />
        </mesh>
        <mesh position={[0.5, -0.3, -0.35]} rotation={[-0.1, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.02, 0.4]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Preload helper
useGLTF.preload("/models/sofa.glb");
