import { Box, forwardRef } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const PreviewImage = forwardRef((props, ref) => {
    return (
      <Box
        bg="white"
        top="0"
        height="100%"
        width="100%"
        position="absolute"
        borderWidth="1px"
        borderStyle="solid"
        rounded="sm"
        borderColor="gray.400"
        as={motion.div}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        {...props}
        ref={ref}
      />
    );
  });
  