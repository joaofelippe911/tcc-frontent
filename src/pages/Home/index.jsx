import { Box, Image, Center, Heading } from '@chakra-ui/react';
import logo from './logo/logo.png';

function Home() {
  return (
    <Center>
      <Box>
      <Heading style={{ marginBottom: '10px' }}>Florália Garden</Heading>
      
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

  



