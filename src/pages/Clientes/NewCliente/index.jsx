import { Box, Heading, useToast } from '@chakra-ui/react';
import { ClienteForm } from '../components/ClienteForm';
import { useCallback } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate } from 'react-router-dom';

export default function NewCliente() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = useCallback(
    async (cliente) => {
      try {
        await httpClient.post('/clientes', cliente);
        toast({
            title: 'Cliente cadastrado com sucesso!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
        navigate('/clientes');
      } catch (err) {
          toast({
              title: err?.response?.data?.message || 'Erro ao cadastrar cliente!',
              status: 'error',
              duration: 10000,
              isClosable: true,
              position: 'top-right'
            });
      }
    },
    [navigate, toast]
  );

  return (
    <Box p={4}>
      <Heading marginBottom={8}>Adicionar Cliente</Heading>
      <ClienteForm onSubmit={handleSubmit} />
    </Box>
  );
}
