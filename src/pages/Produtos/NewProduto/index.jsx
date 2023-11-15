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
        const formData = new FormData();


        console.log({new: produto});

        Object.entries(produto).forEach(([name, value]) => {
          formData.append(name, value);
        })

        await httpClient.post('/produtos', produto, {
          headers: { "Content-Type": 'multipart/form-data' }
        });
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
              title: err?.response?.data?.message || 'Erro ao cadastrar produto!',
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
      <Heading marginBottom={8}>Adicionar produto</Heading>
      <ProdutoForm onSubmit={handleSubmit} />
    </Box>
  );
}
