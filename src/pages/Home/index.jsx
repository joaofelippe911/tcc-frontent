import { Box, Image, Center } from '@chakra-ui/react';
import logo from '../../assets/images/logo.png';

function Home() {
  return (
    <Center>
      <Box>
      
        <Image
          src={logo} 
          alt="logo" 
          boxSize="700px" 
        />
      </Box>
    </Center>
  );
}

export default Home;

  



