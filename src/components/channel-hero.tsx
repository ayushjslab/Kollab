import { format } from "date-fns";
import { motion } from "framer-motion";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <motion.div
      className="mt-20 mx-6 mb-6 p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        className="text-3xl font-extrabold flex items-center gap-2 mb-3"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-yellow-300">#</span>
        {name}
      </motion.p>
      <p className="text-lg font-medium text-white/90">
        This channel was created on{" "}
        <span className="font-semibold text-yellow-300">
          {format(creationTime, "MMMM do, yyyy")}
        </span>
        . Welcome to the very beginning of the{" "}
        <strong className="text-white">{name}</strong> channel.
      </p>
    </motion.div>
  );
};
