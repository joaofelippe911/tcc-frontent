import { Box, Heading, useToast } from '@chakra-ui/react';
import { VendaForm } from '../components/VendaForm';
import { useCallback } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate } from 'react-router-dom';

export default function NewVenda() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = useCallback(
    async (venda) => {
      try {
        await httpClient.post('/vendas', venda);
        toast({
          title: 'Venda cadastrada com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/vendas');
      } catch (err) {
        toast({
          title: err?.response?.data?.message || 'Erro ao cadastrar venda!',
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
      <Heading marginBottom={8}>Adicionar venda</Heading>
      <VendaForm onSubmit={handleSubmit} />
    </Box>
  );
}
