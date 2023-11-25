import { Box, Heading, useToast } from '@chakra-ui/react';
import { ClienteForm } from '../components/ClienteForm';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import Spinner from '../../../components/Spinner';

export default function EditCliente() {
  const [isLoading, setIsLoading] = useState(false);
  const [cliente, setCliente] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadCliente() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get(`/clientes/${id}`, {
          signal: controller.signal,
        });

        setCliente(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }
        
        setIsLoading(false);
        toast({
          title: err?.response?.data?.message || 'Erro ao buscar dados do cliente!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/clientes');
      }
    }

    loadCliente();

    return () => {
      controller.abort();
    };
  }, [id, navigate, toast]);

  const handleSubmit = useCallback(
    async (cliente) => {
      try {
        await httpClient.patch(`/clientes/${id}`, cliente);
        toast({
          title: 'Cliente editado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/clientes');
      } catch (err) {
        toast({
          title: err?.response?.data?.message || 'Erro ao editar cliente!',
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
        <Heading marginBottom={8}>Editar Cliente</Heading>
        <ClienteForm
          onSubmit={handleSubmit}
          cliente={cliente}
          key={cliente?.id}
        />
      </Box>
    </Box>
  );
}
