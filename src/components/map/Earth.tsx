/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

export const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Load textures with error handling
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
  ]);

  // Responsive size calculation
  const earthSize = useMemo(() => {
    if (viewport.width < 400) return 60;  // Mobile
    if (viewport.width < 768) return 85;  // Tablet
    return 110;  // Desktop
  }, [viewport.width]);

  const cloudsSize = earthSize * 1.005; // Slightly larger than earth

  // Texture optimization
  useEffect(() => {
    [colorMap, normalMap, specularMap, cloudsMap].forEach(map => {
      map.anisotropy = 16;
      map.minFilter = THREE.LinearMipmapLinearFilter;
    });
  }, [colorMap, normalMap, specularMap, cloudsMap]);

  // Animation frame
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0012; // Slightly faster rotation
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <mesh ref={earthRef} receiveShadow castShadow>
        <sphereGeometry args={[earthSize, 128, 128]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={normalMap}
          bumpScale={0.8}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={10}
          transparent={true}
          opacity={0.98}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[cloudsSize, 128, 128]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[earthSize * 1.1, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(0x7ec0ee)}
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};