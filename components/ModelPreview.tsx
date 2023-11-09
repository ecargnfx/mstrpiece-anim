import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from "@react-three/drei";

const Model: React.FC<{ url: string }> = ({ url }) => {
    const gltf = useGLTF(url);
    const mesh = useRef<THREE.Mesh>();
  
    useFrame(() => {
      if (mesh.current) {
        mesh.current.rotation.y += 0.01;
      }
    });
  
    return <primitive ref={mesh} object={gltf.scene} />;
};

export default Model;
