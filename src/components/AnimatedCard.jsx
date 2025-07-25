"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5, delay }}
    variants={cardVariants}
  >
    {children}
  </motion.div>
);

export default AnimatedCard;
