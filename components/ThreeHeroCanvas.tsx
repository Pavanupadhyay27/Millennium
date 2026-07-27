"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import SofaModel, { StylizedArmchairFallback } from "./SofaModel";

// Custom Error Boundary for 3D rendering failures
class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("Caught 3D load error. Rendering procedural fallback.", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Scene content controller to orchestrate the camera dolly-in, the veil lift, and mouse parallax
function SceneContent({
  modelUrl,
  onLoaded,
  isLoaded,
  mousePointer,
}: {
  modelUrl: string;
  onLoaded: () => void;
  isLoaded: boolean;
  mousePointer: { x: number; y: number };
}) {
  const veilMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);
  const timeRef = useRef(0);
  const [veilVisible, setVeilVisible] = useState(true);

  // Define uniforms for the veil shader
  const uniforms = useRef({
    uProgress: { value: 0.0 },
    uTime: { value: 0.0 },
    uCreamColor: { value: new THREE.Color("#F7F3EC") },
    uSageColor: { value: new THREE.Color("#2F6F62") },
  });

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (isLoaded) {
      // After load, delay slightly (~400ms) then animate progress from 0.0 to 1.0
      progressRef.current = THREE.MathUtils.damp(
        progressRef.current,
        1.0,
        2.0, // damping speed
        delta
      );

      // Camera dolly-in + orbit animation
      // Start: [0, 0.5, 4.0]
      // End: [0.8, 0.3, 2.5]
      const targetCamPos = new THREE.Vector3(0.8, 0.3, 2.5);
      state.camera.position.lerp(targetCamPos, delta * 2.0);
      state.camera.lookAt(0, 0.1, 0);

      // Hide the veil mesh when animation is basically complete
      if (progressRef.current > 0.99 && veilVisible) {
        setVeilVisible(false);
      }
    } else {
      // Keep camera locked in starting position until loaded
      state.camera.position.set(0, 0.5, 4.0);
      state.camera.lookAt(0, 0.1, 0);
    }

    // Update shader uniforms
    if (veilMaterialRef.current) {
      veilMaterialRef.current.uniforms.uProgress.value = progressRef.current;
      veilMaterialRef.current.uniforms.uTime.value = timeRef.current;
    }
  });

  // Shader source definitions
  const vertexShader = `
    uniform float uProgress;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Multi-octave organic cloth wave displacement
      float wave1 = sin(pos.x * 3.5 + uTime * 4.0) * cos(pos.y * 2.5 + uTime * 2.5) * 0.08;
      float wave2 = sin(pos.y * 6.0 - uTime * 5.0) * 0.03;
      float totalWave = (wave1 + wave2) * (1.0 - uProgress);

      // Skew the pull slightly to simulate being pulled off from the bottom-left toward the top-right
      float pullSkew = (1.0 - uv.x) * uv.y;
      pos.y += uProgress * 3.2 + totalWave;
      pos.z += uProgress * 1.8 + totalWave * 0.5;
      pos.x += uProgress * 0.6 * pullSkew;

      vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -modelViewPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `;

  const fragmentShader = `
    uniform float uProgress;
    uniform vec3 uCreamColor;
    uniform vec3 uSageColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      // High-fidelity weave threads
      float weaveX = step(0.5, sin(vUv.x * 750.0) * 0.5 + 0.5);
      float weaveY = step(0.5, sin(vUv.y * 750.0) * 0.5 + 0.5);
      float threads = mix(weaveX, weaveY, 0.5);
      
      // Thread shadows
      threads += sin(vUv.x * 1500.0) * 0.08;
      threads += sin(vUv.y * 1500.0) * 0.08;

      // Fine organic grain/noise
      float noiseVal = hash(vUv * 1200.0) * 0.06;

      // Blend cream and sage colors
      vec3 baseColor = mix(uCreamColor, uSageColor, 0.12 + noiseVal + threads * 0.06);

      // Advanced fresnel highlight for fabric sheen
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);
      vec3 sheenColor = vec3(0.98, 0.97, 0.94); 
      vec3 finalColor = mix(baseColor, sheenColor, fresnel * 0.5);

      // Dissolve out transparency
      float alpha = 1.0 - smoothstep(0.0, 0.8, uProgress);

      if (alpha < 0.01) {
        discard;
      }

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  return (
    <>
      {/* 3D Model with safe load & fallback handler */}
      <Suspense fallback={null}>
        <CanvasErrorBoundary
          fallback={
            <StylizedArmchairFallback
              isRevealed={isLoaded}
              mousePointer={mousePointer}
            />
          }
        >
          <SofaModel
            url={modelUrl}
            onLoaded={onLoaded}
            isRevealed={isLoaded}
            mousePointer={mousePointer}
          />
        </CanvasErrorBoundary>
      </Suspense>

      {/* Camera attached setup */}
      <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={50}>
        {veilVisible && (
          <mesh position={[0, 0, -0.8]}>
            <planeGeometry args={[2.2, 2.2, 64, 64]} />
            <shaderMaterial
              ref={veilMaterialRef}
              transparent
              depthWrite={false}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms.current}
            />
          </mesh>
        )}
      </PerspectiveCamera>
    </>
  );
}

export default function ThreeHeroCanvas() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePointer, setMousePointer] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor mouse movements over the container to calculate local normalized coordinate tilt (-1 to 1)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePointer({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePointer({ x: 0, y: 0 }); // snap back smoothly
  };

  const handleModelLoaded = () => {
    // 400ms delay as requested after loading resolves to unveil
    setTimeout(() => {
      setIsLoaded(true);
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[550px] md:h-[650px] rounded-3xl overflow-hidden shadow-warm-lg bg-gradient-to-tr from-[#EFE7F7] via-[#F7F3EC] to-[#DFF4EE]"
    >
      {/* Branded Minimal Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-cream gap-4 transition-opacity duration-500">
          <div className="w-12 h-12 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-charcoal font-medium text-lg tracking-wide">
            Millennium Studio
          </p>
        </div>
      )}

      {/* R3F Canvas */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        {/* Catalog lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#DDF" />
        <pointLight position={[0, 4, 2]} intensity={0.6} color="#FFE6CC" />

        {/* Scene orchestration content */}
        <SceneContent
          modelUrl="/models/sofa.glb"
          onLoaded={handleModelLoaded}
          isLoaded={isLoaded}
          mousePointer={mousePointer}
        />

        {/* Ambient reflection presets */}
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
}
