import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";

const Character: React.FC = () => {
  const { scene, animations } = useGLTF("/mstr-walking-firefighter.glb");
  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group); // might need mixer for more complex animations

  useThree(({ camera }) => {
    camera.position.z = 2;
    camera.lookAt(0, 0, 0);
  }); // set camera position for default zoom

  useEffect(() => {
    if (actions && actions.animation) {
      actions.animation.play();
    }
  }, [actions]);

  return <primitive ref={group} object={scene} dispose={null} />;
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
