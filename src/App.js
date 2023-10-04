import { ChakraProvider } from '@chakra-ui/react';
import Layout from './components/Layout';
import { extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import Router from './routes';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: '#ED64A6',
      }
    }
  }
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
