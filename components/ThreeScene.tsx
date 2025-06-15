import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  PerspectiveCamera,
  Stars,
  Environment,
  Trail,
} from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

function ShootingStar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<[number, number, number]>(() => [
    (Math.random() - 0.5) * 20,
    Math.random() * 20,
    (Math.random() - 0.5) * 20,
  ]);

  const [rotation, setRotation] = useState<[number, number, number]>(() => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  ]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x += 0.1;
      meshRef.current.position.y -= 0.1;
      meshRef.current.position.z += 0.05;

      if (meshRef.current.position.y < -10) {
        meshRef.current.position.set(
          (Math.random() - 0.5) * 20,
          20,
          (Math.random() - 0.5) * 20
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
      <Trail
        width={6}
        color={new THREE.Color("#ffffff")}
        length={15}
        decay={1}
        local={false}
        stride={0}
        interval={1}
      />
    </mesh>
  );
}

function ShootingStars() {
  const stars = useMemo(() => Array.from({ length: 15 }), []);
  return (
    <>
      {stars.map((_, i) => (
        <ShootingStar key={i} />
      ))}
    </>
  );
}

function FloatingShapes() {
  const shapesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shapesRef.current) {
      shapesRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={shapesRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[2, 1, 0]}>
          <torusKnotGeometry args={[0.5, 0.2, 128, 32]} />
          <meshPhysicalMaterial
            color="#007AFF"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#007AFF"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-2, -1, 0]}>
          <octahedronGeometry args={[0.6]} />
          <meshPhysicalMaterial
            color="#FF6B6B"
            metalness={0.8}
            roughness={0.2}
            transmission={0.5}
            thickness={0.5}
            emissive="#FF6B6B"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[0, -2, 0]}>
          <dodecahedronGeometry args={[0.5]} />
          <meshPhysicalMaterial
            color="#FFD700"
            metalness={0.9}
            roughness={0.1}
            emissive="#FFD700"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[2, -1, 0]}>
          <icosahedronGeometry args={[0.5]} />
          <meshPhysicalMaterial
            color="#4CAF50"
            metalness={0.7}
            roughness={0.3}
            transmission={0.8}
            thickness={0.5}
            clearcoat={0.5}
            emissive="#4CAF50"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>

      <Float speed={2.8} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-2, 1, 0]}>
          <torusGeometry args={[0.6, 0.2, 32, 100]} />
          <meshPhysicalMaterial
            color="#9C27B0"
            metalness={0.8}
            roughness={0.2}
            emissive="#9C27B0"
            emissiveIntensity={1}
            clearcoat={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

const ThreeScene = () => {
  return (
    <div className="relative w-full h-screen">
      <Canvas className="w-full h-full">
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 5, 30]} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.5}
          penumbra={1}
          intensity={1}
          castShadow
        />

        <FloatingShapes />
        <ShootingStars />
        <Stars
          radius={100}
          depth={50}
          count={7000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <Environment preset="night" />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Welcome to My
            <span className="text-primary"> Portfolio</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Exploring the intersection of creativity and technology through
            interactive 3D experiences
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;
