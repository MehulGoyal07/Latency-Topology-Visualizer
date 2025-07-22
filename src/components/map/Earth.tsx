import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

export const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [
    '/textures/earth_color.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg'
  ]);

  // Fallback if textures fail to load
  useEffect(() => {
    colorMap.anisotropy = 16;
    normalMap.anisotropy = 16;
    specularMap.anisotropy = 16;
  }, [colorMap, normalMap, specularMap]);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef} receiveShadow castShadow>
      <sphereGeometry args={[100, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        bumpMap={normalMap}
        bumpScale={0.5}
        specularMap={specularMap}
        specular={new THREE.Color(0x333333)}
        shininess={5}
        transparent={true}
        opacity={0.95}
      />
    </mesh>
  );
};