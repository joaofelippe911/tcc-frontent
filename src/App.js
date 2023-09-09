import { ChakraProvider } from '@chakra-ui/react';
import Layout from './components/Layout';
import { extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
