import { Box, Heading, useToast } from '@chakra-ui/react';
import { ColaboradorForm } from '../components/ColaboradorForm';
import { useCallback } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate } from 'react-router-dom';

export default function NewColaborador() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = useCallback(
    async (colaborador) => {
      try {
        await httpClient.post('/colaboradores', colaborador);
        toast({
          title: 'Colaborador cadastrado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/colaborador');
      } catch (err) {
        toast({
          title: 'Erro ao cadastrar colaborador!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [navigate, toast]
  );

  return (
    <Box p={4}>
      <Heading marginBottom={8}>Adicionar Colaborador</Heading>
      <ColaboradorForm onSubmit={handleSubmit} />
    </Box>
  );
}
