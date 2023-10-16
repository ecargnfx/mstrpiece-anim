import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';

const Character: React.FC = () => {
  const ref = useRef();
  const { nodes, animations } = useGLTF('/mstr-walking-firefighter.glb');
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (actions && actions.animation) {
      actions.animation.play();
      console.log(nodes.hips);
      console.log(animations[0].tracks);
      console.log(actions.animation._clip.tracks[1]);
      console.log(Object.keys(nodes));

    }
  }, [actions]);

  return (
    <group ref={ref} scale={[2, 2, 2]}>
      <mesh 
        geometry={nodes.mesh.geometry} 
        material={nodes.mesh.material} 
        position={[0, 0, 0]} 
      />
    </group>
  );
};

const CharacterScene: React.FC = () => {
  return (
    <Canvas>
      <ambientLight />
      <Suspense fallback={null}>
        <Character />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default CharacterScene;
