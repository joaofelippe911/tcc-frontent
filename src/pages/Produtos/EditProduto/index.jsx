import { Box, Heading, useToast } from '@chakra-ui/react';
import { ProdutoForm } from '../components/ProdutoForm';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import Spinner from '../../../components/Spinner';

export default function EditProduto() {
  const [isLoading, setIsLoading] = useState(false);
  const [produto, setProduto] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduto() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get(`/produtos/${id}`, {
          signal: controller.signal,
        });

        setProduto(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: err.response.data.message || 'Erro ao buscar dados do produto!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/produtos');
      }
    }

    loadProduto();

    return () => {
      controller.abort();
    };
  }, [id, navigate, toast]);

  const handleSubmit = useCallback(
    async (produto) => {
      try {
        await httpClient.patch(`/produtos/${id}`, produto);
        toast({
          title: 'Produto editado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/produtos');
      } catch (err) {
        toast({
          title: err.response.data.message || 'Erro ao editar produto!',
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
        <Heading marginBottom={8}>Editar produto</Heading>
        <ProdutoForm
          onSubmit={handleSubmit}
          produto={produto}
          key={produto?.id}
        />
      </Box>
    </Box>
  );
}
