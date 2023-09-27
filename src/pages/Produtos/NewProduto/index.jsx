import { Box, Heading, useToast } from '@chakra-ui/react';
import { ProdutoForm } from '../components/ProdutoForm';
import { useCallback } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate } from 'react-router-dom';

export default function NewProduto() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = useCallback(
    async (produto) => {
      try {
        await httpClient.post('/produtos', produto);
        toast({
            title: 'Produto cadastrado com sucesso!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
        navigate('/produtos');
      } catch (err) {
          toast({
              title: 'Erro ao cadastrar produto!',
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
      <Heading marginBottom={8}>Adicionar produto</Heading>
      <ProdutoForm onSubmit={handleSubmit} />
    </Box>
  );
}
