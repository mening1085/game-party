import { motion } from "framer-motion";
import Image from "next/image";

const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          {/* Left Section - Featured Work Title */}
          <div>
            <h2 className="text-5xl md:text-7xl font-bold text-textLight leading-tight">
              FEATURED
              <br />
              WORK
            </h2>
          </div>

          {/* Right Section - Description and Image */}
          <div className="space-y-6 mt-12 md:mt-0">
            <p className="text-lg text-textLight mb-8">
              As a front end developer using modern ideas simplicity design and
              universal visual identification tailored to dedicated and current
              market.
            </p>
            <button className="btn btn-primary mb-12">
              Let's discuss &gt;
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-textLight mb-2">
                  WEB DESIGN <span className="text-primary">(01)</span>
                </h3>
                <p className="text-lg text-textLight">
                  Creating engaging digital experiences
                </p>
              </div>
              <a
                href="#"
                className="text-primary hover:underline flex items-center"
              >
                View projects <span className="ml-2">&gt;</span>
              </a>
            </div>

            <div className="glass-card w-full h-80 flex items-center justify-center mt-8">
              {/* Placeholder for image */}
              <span className="text-textLight">
                Exhibition Mockup Image Placeholder
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
