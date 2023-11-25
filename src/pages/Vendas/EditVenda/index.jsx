import { Box, Heading, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import Spinner from '../../../components/Spinner';
import { VendaForm } from '../components/VendaForm';

export default function EditVenda() {
  const [isLoading, setIsLoading] = useState(false);
  const [venda, setVenda] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadVenda() {
      try {
        setIsLoading(true);

        const { data } = await httpClient.get(`/vendas/${id}`, {
          signal: controller.signal,
        });

        setVenda(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: err?.response?.data?.message || 'Erro ao buscar dados da venda!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/vendas');
      }
    }

    loadVenda();

    return () => {
      controller.abort();
    };
  }, [id, navigate, toast]);

  const handleSubmit = useCallback(
    async (venda) => {
      try {

        await httpClient.patch(`/vendas/${id}`, venda);
        
        toast({
          title: 'Venda editada com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/vendas');
      } catch (err) {
        toast({
          title: err?.response?.data?.message || 'Erro ao editar venda!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [id, navigate, toast]
  );

  return (
    <Box position="relative">
      <Spinner spinning={isLoading} />
      <Box p={4}>
        <Heading marginBottom={8}>Editar Venda</Heading>
        <VendaForm
          onSubmit={handleSubmit}
          venda={venda}
          key={venda?.id}
        />
      </Box>
    </Box>
  );
}
