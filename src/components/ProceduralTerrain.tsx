"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// --- SHADERS ---

const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uBiomeMix;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;
  varying vec3 vNormalComputed;

  // Helper function for Noise
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  // Simplex 3D Noise 
  // (Standard implementation found in many GLSL libraries)
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0.0 + 0.0 * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

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

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  // Helper for FBM (Fractal Brownian Motion)
  float fbm(vec3 x, int octaves, float persistence, float lacunarity) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 5; ++i) { // Fixed loop size for unroll
        if(i >= octaves) break;
        v += a * snoise(x);
        x = x * lacunarity + shift;
        a *= persistence;
    }
    return v;
  }

  // --- TERRAIN GENERATION LOGIC ---
  float getElevation(vec2 uv) {
    // Scroll effect: move noise along Y axis
    vec2 pos = uv * 3.0; // Base scale
    pos.y -= uScroll * 0.5; // Move terrain with scroll
    
    // Base params
    float elevation = 0.0;
    
    // BIOME 1: SAND (Smooth, rolling)
    float sand = snoise(vec3(pos * 1.5, uTime * 0.05)) * 0.3;
    sand += snoise(vec3(pos * 5.0, uTime * 0.05)) * 0.05;
    
    // BIOME 2: DUNES (Directional, ridged)
    float dunes = abs(snoise(vec3(pos * 2.0 + vec2(0.0, uTime * 0.1), uTime * 0.02)));
    dunes = smoothstep(0.0, 1.0, dunes); // Sharpen
    dunes *= 0.8;
    
    // BIOME 3: ROCK (Jagged, FBM)
    float rock = fbm(vec3(pos * 3.0, uTime * 0.05), 4, 0.5, 2.0);
    rock = rock * 1.2;
    
    // MIXING BIOMES
    // uBiomeMix goes from 0.0 to 2.0
    // 0.0 = Sand
    // 1.0 = Dunes
    // 2.0 = Rock
    
    float mix1 = smoothstep(0.0, 1.0, uBiomeMix); // 0->1 : Sand->Dunes
    float mix2 = smoothstep(1.0, 2.0, uBiomeMix); // 1->2 : Dunes->Rock
    
    // Blend Sand -> Dunes
    float base = mix(sand, dunes, mix1);
    // Blend Result -> Rock
    float finalElevation = mix(base, rock, mix2);
    
    // Add overall wave breathing
    finalElevation += sin(uv.x * 5.0 + uTime) * 0.1 * (1.0 - mix2); // Less breathing on rocks
    
    return finalElevation;
  }

  void main() {
    vUv = uv;
    vPosition = position;
    
    // Calculate elevation for current vertex
    float elevation = getElevation(uv);
    vElevation = elevation;
    
    vec3 newPos = position;
    newPos.z += elevation; // Displace Z (up/down in local plane space)
    
    // Compute Normal via Finite Difference (neighbors)
    float offset = 0.01;
    float elX = getElevation(uv + vec2(offset, 0.0));
    float elY = getElevation(uv + vec2(0.0, offset));
    
    vec3 tangentX = vec3(offset, 0.0, elX - elevation);
    vec3 tangentY = vec3(0.0, offset, elY - elevation);
    
    vNormalComputed = normalize(cross(tangentX, tangentY));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uBiomeMix;
  
  varying float vElevation;
  varying vec2 vUv;
  varying vec3 vNormalComputed;

  void main() {
    // Lighting
    vec3 lightPos = vec3(10.0, 10.0, 10.0);
    vec3 lightDir = normalize(lightPos);
    float diff = max(dot(vNormalComputed, lightDir), 0.0);
    
    // Colors
    // Sand Colors
    vec3 colorSandDeep = vec3(0.76, 0.60, 0.42); // #C2996B
    vec3 colorSandHigh = vec3(0.93, 0.85, 0.70); // #EDE9B3
    
    // Dune Colors (Warmer, reddish)
    vec3 colorDuneDeep = vec3(0.55, 0.27, 0.07); // #8B4513
    vec3 colorDuneHigh = vec3(0.82, 0.51, 0.26); // #D28242
    
    // Rock Colors (Cold, grey/blue)
    vec3 colorRockDeep = vec3(0.15, 0.15, 0.20); // Dark Blue Grey
    vec3 colorRockHigh = vec3(0.50, 0.55, 0.60); // Light Grey
    
    // Mix based on elevation
    float elevationMix = smoothstep(-0.5, 0.8, vElevation);
    
    vec3 sandColor = mix(colorSandDeep, colorSandHigh, elevationMix);
    vec3 duneColor = mix(colorDuneDeep, colorDuneHigh, elevationMix);
    vec3 rockColor = mix(colorRockDeep, colorRockHigh, elevationMix + 0.1); // Rocks often have highlight on edges
    
    // Biome Mixing (Same logic as vertex)
    float mix1 = smoothstep(0.0, 1.0, uBiomeMix);
    float mix2 = smoothstep(1.0, 2.0, uBiomeMix);
    
    vec3 finalColor = mix(sandColor, duneColor, mix1);
    finalColor = mix(finalColor, rockColor, mix2);
    
    // Add shadow/light
    finalColor *= (0.5 + 0.5 * diff);
    
    // Fog / Atmosphere (Distance fade)
    // Simple radial fade for infinite look to hide plane edges
    float dist = distance(vUv, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Create the custom material
const TerrainMaterial = shaderMaterial(
  {
    uTime: 0,
    uScroll: 0,
    uBiomeMix: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ TerrainMaterial });

// Add type definition for the custom material
declare module "@react-three/fiber" {
  interface ThreeElements {
    terrainMaterial: THREE.ShaderMaterial & {
      uTime: number;
      uScroll: number;
      uBiomeMix: number;
    };
  }
}

interface ProceduralTerrainProps {
  scrollProgress: number; // 0 to 1
}

export default function ProceduralTerrain({ scrollProgress }: ProceduralTerrainProps) {
  const materialRef = useRef<THREE.ShaderMaterial & { uTime: number; uScroll: number; uBiomeMix: number }>(null);
  
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      
      // Smoothly interpolate uScroll towards the prop value (easing)
      // Or just pass it directly if parent handles easing.
      // Let's assume parent passes raw scroll, we can smooth here if needed.
      // But prompt says "Transitions continues (scrub)".
      
      materialRef.current.uScroll = scrollProgress * 10.0; // Scale up scroll for more movement
      
      // Map scrollProgress to BiomeMix (0 -> 2)
      // 0.0 - 0.33: Sand
      // 0.33 - 0.66: Dunes
      // 0.66 - 1.0: Rock
      // We map 0..1 to 0..2
      materialRef.current.uBiomeMix = scrollProgress * 2.5; 
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      <planeGeometry args={[10, 10, 128, 128]} />
      {/* @ts-expect-error - Custom shader material prop types */}
      <terrainMaterial ref={materialRef} side={THREE.DoubleSide} transparent={true} />
    </mesh>
  );
}
