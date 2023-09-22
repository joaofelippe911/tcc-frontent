import { Box, Heading, useToast } from '@chakra-ui/react';
import { FuncaoForm } from '../components/FuncaoForm';
import { useCallback } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate } from 'react-router-dom';

export default function NewFuncao() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = useCallback(
    async (funcao) => {
      try {
        await httpClient.post('/funcoes', funcao);
        toast({
            title: 'Funcao cadastrado com sucesso!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
        navigate('/funcao');
      } catch (err) {
          toast({
              title: 'Erro ao cadastrar funcao!',
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
    <Box>
      <Heading marginBottom={8}>Adicionar funcao</Heading>
      <FuncaoForm onSubmit={handleSubmit} />
    </Box>
  );
}
