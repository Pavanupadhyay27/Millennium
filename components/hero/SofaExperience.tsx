"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { RefreshCw } from "lucide-react";

// Preload the sofa model to avoid latency
useGLTF.preload("/models/sofa.glb");

const INTERIOR_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200", // Warm Beige Lounge
  "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1200", // Minimalist White Studio
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200", // Brutalist Modern Loft
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200"  // Classy Oak Library
];

// Custom shader material uniforms interface
interface VeilUniforms {
  [key: string]: THREE.IUniform;
  uMask: { value: THREE.CanvasTexture | null };
  uRevealProgress: { value: number };
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uAccent: { value: THREE.Color };
}

// Fallback Procedural Sofa Model if the user's GLTF is missing
function StylizedSofaFallback({ rotationX, rotationY }: { rotationX: number; rotationY: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotationY, delta * 5);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotationX, delta * 5);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Sofa Main Seat Cushion */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2.2, 0.35, 0.9]} />
        <meshStandardMaterial color="#2F6F62" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Left armrest */}
      <mesh position={[-1.15, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.95]} />
        <meshStandardMaterial color="#2F6F62" roughness={0.7} />
      </mesh>
      {/* Right armrest */}
      <mesh position={[1.15, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.95]} />
        <meshStandardMaterial color="#2F6F62" roughness={0.7} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.4, -0.38]}>
        <boxGeometry args={[2.1, 0.8, 0.2]} />
        <meshStandardMaterial color="#2F6F62" roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-1, -0.6, -0.35], [1, -0.6, -0.35], [-1, -0.6, 0.35], [1, -0.6, 0.35]].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.04, 0.03, 0.45]} />
          <meshStandardMaterial color="#1F1B16" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Actual Sofa Model Loader
function ActualSofa({ modelUrl, rotationX, rotationY, onLoaded }: { modelUrl: string; rotationX: number; rotationY: number; onLoaded: () => void }) {
  const { scene } = useGLTF(modelUrl);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      // Set correct scale and center the model
      scene.position.set(0, -0.35, 0);
      scene.scale.set(0.9, 0.9, 0.9);
      onLoaded();
    }
  }, [scene, onLoaded]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotationY, delta * 5);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotationX, delta * 5);
    }
  });

  return <primitive ref={groupRef} object={scene} />;
}

// Main 3D Canvas Scene content orchestrator
function SceneContent({
  modelUrl,
  mousePos,
  isRevealed,
  setIsRevealed,
  setIsAutoFinishing,
  onLoaded,
}: {
  modelUrl: string;
  mousePos: THREE.Vector2;
  isRevealed: boolean;
  setIsRevealed: (val: boolean) => void;
  setIsAutoFinishing: (val: boolean) => void;
  onLoaded: () => void;
}) {
  const veilMeshRef = useRef<THREE.Mesh>(null);
  const veilMatRef = useRef<THREE.ShaderMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  
  const modelSuccess = true;
  const timeRef = useRef(0);
  const scratchCount = useRef(0);

  // 1. Create offline HTML5 canvas texture for cursor scratching reveal mask
  const maskCanvas = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 128, 128);
    }
    return canvas;
  }, []);

  const maskTexture = useMemo(() => {
    const texture = new THREE.CanvasTexture(maskCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [maskCanvas]);

  // 2. Uniforms for the cloth shader
  const uniforms = useMemo<VeilUniforms>(() => ({
    uMask: { value: maskTexture },
    uRevealProgress: { value: 0.0 },
    uTime: { value: 0.0 },
    uColor: { value: new THREE.Color("#F7F3EC") }, // Cream background color
    uAccent: { value: new THREE.Color("#2F6F62") }, // Sage Green glow boundary
  }), [maskTexture]);

  // Handle drawing onto the scratch mask canvas
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isRevealed || !e.uv) return;
    
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    // Draw white brush circle at the relative UV cursor coordinate
    const x = e.uv.x * 128;
    const y = (1 - e.uv.y) * 128; // flip Y coordinate for canvas alignment
    
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    
    maskTexture.needsUpdate = true;

    // Periodically (throttled) measure scratch coverage area percentage
    scratchCount.current += 1;
    if (scratchCount.current % 8 === 0) {
      const imgData = ctx.getImageData(0, 0, 128, 128).data;
      let whitePixels = 0;
      for (let i = 0; i < imgData.length; i += 4) {
        if (imgData[i] > 128) whitePixels++;
      }
      const percentage = whitePixels / (128 * 128);
      
      // Auto-trigger full reveal wave transition at 35% scratch coverage
      if (percentage >= 0.35) {
        setIsAutoFinishing(true);
        triggerRevealSequence();
      }
    }
  };

  const triggerRevealSequence = () => {
    if (!veilMatRef.current) return;
    
    // Animate uRevealProgress from 0 to 1 via GSAP
    gsap.to(veilMatRef.current.uniforms.uRevealProgress, {
      value: 1.0,
      duration: 1.8,
      ease: "power2.inOut",
      onComplete: () => {
        setIsRevealed(true);
        setIsAutoFinishing(false);
      },
    });
  };

  // Custom vertex and fragment shaders for veil displacement and scratching
  const vertexShader = `
    uniform float uRevealProgress;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // 1. Idle fabric grain sway waves
      float wave = sin(pos.x * 3.5 + uTime * 2.0) * cos(pos.y * 3.0 + uTime * 1.5) * 0.05;
      pos.z += wave * (1.0 - uRevealProgress);

      // 2. Wave-lift ripple translation (pulls curtain upwards and backwards)
      pos.y += uRevealProgress * 4.2 + (wave * 0.5);
      pos.z += uRevealProgress * 2.2;
      pos.x += uRevealProgress * 0.4 * (1.0 - uv.x);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform sampler2D uMask;
    uniform float uRevealProgress;
    uniform vec3 uColor;
    uniform vec3 uAccent;
    varying vec2 vUv;
    varying vec3 vNormal;

    // Simple hash-based noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      // 1. Sample reveal mask texture
      float maskVal = texture2D(uMask, vUv).r;

      // 2. Mix mask with GSAP progress wave
      float reveal = max(maskVal, uRevealProgress);

      // 3. Render fabric thread weave details
      float threadX = step(0.5, sin(vUv.x * 600.0) * 0.5 + 0.5);
      float threadY = step(0.5, sin(vUv.y * 600.0) * 0.5 + 0.5);
      float fabric = mix(threadX, threadY, 0.5);
      float grainNoise = hash(vUv * 800.0) * 0.08;

      vec3 finalBase = mix(uColor, uColor * 0.93, fabric * 0.06 + grainNoise);

      // 4. Glow boundary edge line
      float edgeLower = 0.05;
      float edgeUpper = 0.35;
      float edgeGlow = smoothstep(edgeLower, edgeUpper, reveal) * (1.0 - step(edgeUpper, reveal));
      
      // Inject Sage Green into edge boundaries
      vec3 col = mix(finalBase, uAccent, edgeGlow * 0.7);

      // 5. Discard pixels fully inside scratch mask paths
      float alpha = 1.0 - smoothstep(0.25, 0.45, reveal);
      if (alpha < 0.02) {
        discard;
      }

      gl_FragColor = vec4(col, alpha);
    }
  `;

  // Parallax and light drift controller loop
  useFrame((state, delta) => {
    timeRef.current += delta;

    if (veilMatRef.current) {
      veilMatRef.current.uniforms.uTime.value = timeRef.current;
    }

    // Parallax light drift post-reveal
    if (isRevealed && pointLightRef.current) {
      const targetLightX = mousePos.x * 3.5;
      const targetLightY = mousePos.y * 2.5;
      
      pointLightRef.current.position.x = THREE.MathUtils.lerp(pointLightRef.current.position.x, targetLightX, delta * 3);
      pointLightRef.current.position.y = THREE.MathUtils.lerp(pointLightRef.current.position.y, targetLightY, delta * 3);
    }
  });

  return (
    <>
      {/* Ambient Lighting */}
      <ambientLight intensity={isRevealed ? 0.7 : 0.4} />

      {/* Parallax drifting point light */}
      <pointLight
        ref={pointLightRef}
        position={[0, 1.5, 2]}
        intensity={isRevealed ? 35.0 : 10.0}
        color="#FDF3D8"
        distance={8}
        decay={2.0}
      />
      <directionalLight position={[2, 3, 2]} intensity={isRevealed ? 2.5 : 1.0} color="#ffffff" />

      {/* Interactive model loader */}
      <group position={[0, -0.1, 0]}>
        {modelSuccess ? (
          <ActualSofa
            modelUrl={modelUrl}
            rotationX={isRevealed ? -mousePos.y * 0.15 : 0}
            rotationY={isRevealed ? mousePos.x * 0.35 : 0}
            onLoaded={onLoaded}
          />
        ) : (
          <StylizedSofaFallback
            rotationX={isRevealed ? -mousePos.y * 0.15 : 0}
            rotationY={isRevealed ? mousePos.x * 0.35 : 0}
          />
        )}
      </group>

      {/* Scratchable shader veil curtain mesh */}
      {!isRevealed && (
        <mesh
          ref={veilMeshRef}
          position={[0, 0, 0.85]}
          onPointerMove={handlePointerMove}
        >
          <planeGeometry args={[2.5, 2.0, 48, 48]} />
          <shaderMaterial
            ref={veilMatRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  );
}

// Container Component wrapping the Canvas
export default function SofaExperience({ modelUrl }: { modelUrl: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAutoFinishing, setIsAutoFinishing] = useState(false);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0, 0));
  const [activeBg, setActiveBg] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePos(new THREE.Vector2(x, y));
  };

  const handleMouseLeave = () => {
    setMousePos(new THREE.Vector2(0, 0)); // Resets back to center
  };

  const handleModelLoaded = () => {
    setIsLoaded(true);
  };

  // Reset function to re-scratch the veil
  const handleResetVeil = () => {
    setIsRevealed(false);
    setIsAutoFinishing(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full rounded-[32px] overflow-hidden shadow-warm-xl border border-charcoal/5 group select-none cursor-crosshair bg-[#12100E]"
    >
      {/* Premium Interior Background cross-fade */}
      <div className="absolute inset-0 z-0">
        {INTERIOR_BACKGROUNDS.map((bgUrl, idx) => (
          <div
            key={idx}
            style={{ backgroundImage: `url(${bgUrl})` }}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              activeBg === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } transform`}
          />
        ))}
        {/* Soft overlay to blend R3F point lights with background photo */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />
      </div>

      {/* 1. Loading screen until model resolves */}
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F7F3EC] gap-4">
          <div className="w-10 h-10 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-charcoal font-bold text-sm tracking-wide">
            Assembling studio scene...
          </p>
        </div>
      )}

      {/* 2. Interactive Guide Hint Overlay */}
      {!isRevealed && isLoaded && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center bg-charcoal/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-warm-lg animate-pulse">
          <p className="text-[10px] text-cream font-bold tracking-widest uppercase">
            {isAutoFinishing ? "Revealing sofa model..." : "Scratch/Move cursor to unveil sofa"}
          </p>
        </div>
      )}

      {/* 3. Reset Button (Only visible after reveal is complete) */}
      {isRevealed && (
        <button
          onClick={handleResetVeil}
          className="absolute bottom-6 right-6 z-20 bg-white/80 hover:bg-white text-charcoal border border-charcoal/10 rounded-full p-2.5 shadow-warm-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
          title="Reset scratch veil"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-Cover
        </button>
      )}

      {/* 4. Canvas Frame */}
      <Canvas eventSource={containerRef as unknown as React.MutableRefObject<HTMLElement>} className="w-full h-full relative z-10">
        <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={55} />
        
        <SceneContent
          modelUrl={modelUrl}
          mousePos={mousePos}
          isRevealed={isRevealed}
          setIsRevealed={setIsRevealed}
          setIsAutoFinishing={setIsAutoFinishing}
          onLoaded={handleModelLoaded}
        />
      </Canvas>

      {/* 5. Interior Selector (Only visible after reveal is complete) */}
      {isRevealed && (
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-white/80 dark:bg-charcoal/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-charcoal/10 shadow-warm-md">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-charcoal/50 dark:text-cream/50 mr-1.5">Rooms</span>
          {INTERIOR_BACKGROUNDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBg(idx)}
              className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all flex items-center justify-center ${
                activeBg === idx
                  ? "bg-charcoal text-cream dark:bg-cream dark:text-charcoal scale-110 shadow-warm-sm"
                  : "bg-charcoal/5 text-charcoal dark:bg-cream/10 dark:text-cream hover:bg-charcoal/15 dark:hover:bg-cream/20"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
