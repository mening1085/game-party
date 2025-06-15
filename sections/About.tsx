import { motion } from "framer-motion";
import Image from "next/image";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-textLight mb-4">
              Olive Studio
            </h2>
            <p className="text-lg text-textLight">
              Olive Studio brings your vision to life with stunning designs that
              reverberate through time, creating waves of creativity and success
              for your brand.
            </p>
            <button className="btn btn-primary">Let's discuss &gt;</button>
          </div>

          <div className="space-y-6 mt-12 md:mt-0">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">
                CODEWAVE SOLUTIONS
              </h3>
              <a
                href="#"
                className="text-textLight hover:text-primary transition-colors duration-300 flex items-center"
              >
                Read More <span className="ml-2">&gt;</span>
              </a>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">
                PIXELCRAFT DEVELOPERS
              </h3>
              <a
                href="#"
                className="text-textLight hover:text-primary transition-colors duration-300 flex items-center"
              >
                Read More <span className="ml-2">&gt;</span>
              </a>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">
                NEXTGEN CODERS
              </h3>
              <a
                href="#"
                className="text-textLight hover:text-primary transition-colors duration-300 flex items-center"
              >
                Read More <span className="ml-2">&gt;</span>
              </a>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">
                BYTELOGIC SYSTEMS
              </h3>
              <a
                href="#"
                className="text-textLight hover:text-primary transition-colors duration-300 flex items-center"
              >
                Read More <span className="ml-2">&gt;</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
