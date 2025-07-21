import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
 const [colorMap, bumpMap, specularMap] = useLoader(TextureLoader, [
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', // Color
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg', // Bump/Normal
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg', // Specular
]);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[100, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.5}
        specularMap={specularMap}
        specular={new THREE.Color('grey')}
        shininess={5}
        transparent={true}
        opacity={0.95}
      />
    </mesh>
  );
};