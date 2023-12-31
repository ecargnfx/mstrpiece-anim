import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { useGLTF, useAnimations, PerspectiveCamera, Environment } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import '../app/globals.css'; 

interface CharacterProps {
    url: string;
    position?: [number, number, number]; 
    rotation?: [number, number, number];
  }

const Character: React.FC<CharacterProps> = ({ url, position, rotation }) => {
  const { scene, animations } = useGLTF(url);
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

  return <primitive ref={group} object={scene} dispose={null} position={position} rotation={rotation} />; 
};

interface CharacterSceneProps {
    url?: string;
  }

const CharacterScene: React.FC<CharacterSceneProps> = ({ url = "/monk.glb" }) => {
 return (
    <Canvas className="w-full h-full bg-lightgray">
      <ambientLight />
      <Suspense fallback={null}>
        <Character url={url} position={[2, 0, 0]} rotation={[0, 5, 0]} /> 
        <Character url="/wuxia-female.glb" position={[-1, 0, 0]} rotation={[0, 90, 0]} /> 
        <Environment background={true} path="/skybox/temple/" files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']} />
      </Suspense>
      <OrbitControls />
  </Canvas>
 );
};

export default CharacterScene;
