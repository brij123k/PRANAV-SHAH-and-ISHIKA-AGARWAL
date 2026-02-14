import { motion } from "framer-motion";
import andImage from "@/assets/and (1).png";

interface InvitationContentProps {
  isVisible: boolean;
  currentPage?: number;
}

const InvitationContent = ({ isVisible, currentPage = 0 }: InvitationContentProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 py-2 sm:py-12 md:py-16 text-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: currentPage > 0 ? "-100vh" : 0
      }}
      transition={{ 
        opacity: { duration: 1.2, delay: 0.4, ease: "easeOut" },
        y: { duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }
      }}
    >

      {/* Prayer text */}
      <motion.div
        className="mb-8 sm:mb-10 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <p className="font-serif-elegant text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-[1.2] uppercase">
          THIS IS WHERE
        </p>
        <p className="font-serif-elegant text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-[1.2] uppercase">
          OUR FOREVER BEGINS.
        </p>
      </motion.div>

      {/* Names vertically stacked with "and" image */}
      <motion.div
        className="flex flex-col items-center justify-center gap-0"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        {/* PRANAV SHAH - NO overlap with image */}
        <motion.h1
          className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]"
          style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', serif",
            color: '#2d2d2d',
            fontWeight: 400,
            letterSpacing: '0.05em'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
        >
          PRANAV SHAH
        </motion.h1>

        {/* "and" image - only overlaps ISHIKA AGARWAL (bottom), NOT PRANAV SHAH (top) 
            To adjust overlap amount, change -mb-X value:
            -mb-6 = medium overlap
            -mb-8 = more overlap
            -mb-10 = even more overlap
        */}
        <motion.div
          className="flex-shrink-0 relative z-10 -mb-6 sm:-mb-8 md:-mb-10"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <img 
            src={andImage} 
            alt="and" 
            className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-auto object-contain"
            style={{
              filter: 'opacity(0.9)'
            }}
          />
        </motion.div>

        {/* ISHIKA AGARWAL - will have overlap from image above */}
        <motion.h1
          className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]"
          style={{ 
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', serif",
            color: '#2d2d2d',
            fontWeight: 400,
            letterSpacing: '0.05em'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1.7, ease: "easeOut" }}
        >
          ISHIKA AGARWAL
        </motion.h1>
      </motion.div>

      {/* Save the Date */}
      <motion.div
        className="mt-12 sm:mt-16 md:mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
      </motion.div>
    </motion.div>
  );
};

export default InvitationContent;