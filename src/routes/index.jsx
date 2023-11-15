import { Box, Container, Spinner } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useAuthContext } from '../contexts/AuthContext';
import SignRoutes from './SignRoutes';

export default function Router() {
  const { signed, loading } = useAuthContext();

  if (loading) {
    return (
      <Container
        py={{ base: '12', md: '24' }}
        px={{ base: '0', sm: '8' }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" thickness='2px' />
        </Box>
      </Container>
    );
  }

  return signed ? <Layout /> : <SignRoutes />;
}
