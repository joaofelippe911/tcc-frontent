import { Box, Heading, useToast } from '@chakra-ui/react';
import { FornecedorForm } from '../components/FornecedorForm';
import { useCallback } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate } from 'react-router-dom';

export default function NewFornecedor() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = useCallback(
    async (fornecedor) => {
      try {
        await httpClient.post('/fornecedores', fornecedor);
        toast({
            title: 'Fornecedor cadastrado com sucesso!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
        navigate('/fornecedores');
      } catch (err) {
          toast({
              title: err?.response?.data?.message || 'Erro ao cadastrar fornecedor!',
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
      <Heading marginBottom={8}>Adicionar Fornecedor</Heading>
      <FornecedorForm onSubmit={handleSubmit} />
    </Box>
  );
}
