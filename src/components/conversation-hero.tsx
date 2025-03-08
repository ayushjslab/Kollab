import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

export const ConversationHero = ({
  name = "Member",
  image,
}: ConversationHeroProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <motion.div
      className="mt-20 mx-6 mb-6 p-6 bg-gradient-to-r from-[#1f2522] to-[#3e4443] text-white rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center gap-4 mb-3"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Avatar className="size-16 border-2 border-teal-700 shadow-md">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-teal-700 text-white text-xl font-semibold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-700">
          {name}
        </p>
      </motion.div>
      <p className="text-lg font-medium text-white/90">
        This conversation is just between you and{" "}
        <strong className="text-teal-400">{name}</strong>.
      </p>
    </motion.div>
  );
};
