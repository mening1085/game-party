import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Torus,
  Box,
  Text,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function AnimatedSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#007AFF"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

function FloatingCube() {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.5;
      cubeRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      cubeRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Box ref={cubeRef} args={[0.5, 0.5, 0.5]} position={[2, 0, 0]}>
      <meshStandardMaterial color="#FF6B6B" metalness={0.5} roughness={0.2} />
    </Box>
  );
}

function RotatingTorus() {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Torus ref={torusRef} args={[0.7, 0.2, 16, 100]} position={[-2, 0, 0]}>
      <meshStandardMaterial color="#4CAF50" metalness={0.5} roughness={0.2} />
    </Torus>
  );
}

const Scene3D = () => {
  return (
    <div className="h-[500px] w-full">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 1, 1]} intensity={1} />
          <pointLight position={[-2, -1, -1]} intensity={0.5} />

          <AnimatedSphere />
          <FloatingCube />
          <RotatingTorus />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Scene3D;
