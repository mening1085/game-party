import dynamic from "next/dynamic";
import { Suspense } from "react";

// Client-side only Three.js components
const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-textLight mb-4">
          Welcome to My
          <span className="text-primary"> Portfolio</span>
        </h1>
        <p className="text-xl md:text-2xl font-body text-secondary max-w-2xl mx-auto">
          Exploring the intersection of creativity and technology through
          interactive 3D experiences
        </p>
      </div>
    </div>
  ),
});

const Hero3D = () => {
  return (
    <div className="h-screen w-full relative">
      <div className="relative h-full w-full">
        <Suspense fallback={null}>
          <ThreeScene />
        </Suspense>
      </div>
    </div>
  );
};

export default Hero3D;
