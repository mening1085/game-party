import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        {/* Left Section */}
        <div className="flex flex-col justify-center h-full py-20">
          <p className="text-xl text-primary mb-4">(HELLO, SAIM)</p>
          <h1 className="text-6xl md:text-8xl font-bold text-textLight leading-tight">
            FRONT <span className="font-heading italic">end</span>
            <br />
            DEVELOPER
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-between h-full py-20">
          <div className="mb-12">
            <p className="text-lg text-textLight mb-8">
              As a front end developer using modern ideas simplicity design and
              universal visual identification tailored to dedicated and current
              market.
            </p>
            <button className="btn btn-primary">Let's discuss &gt;</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="glass-card w-full h-64 flex items-center justify-center">
                {/* Placeholder for image */}
                <span className="text-textLight">Image Placeholder 1</span>
              </div>
            </div>
            <div className="glass-card w-full h-64 flex items-center justify-center">
              {/* Placeholder for image */}
              <span className="text-textLight">Image Placeholder 2</span>
            </div>
            <div className="glass-card w-full h-64 flex items-center justify-center">
              {/* Placeholder for image */}
              <span className="text-textLight">Image Placeholder 3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
