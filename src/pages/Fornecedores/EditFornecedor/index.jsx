import { Box, Heading, useToast } from '@chakra-ui/react';
import { FornecedorForm } from '../components/FornecedorForm';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import Spinner from '../../../components/Spinner';

export default function EditFornecedor() {
  const [isLoading, setIsLoading] = useState(false);
  const [fornecedor, setFornecedor] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadFornecedor() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get(`/fornecedores/${id}`, {
          signal: controller.signal,
        });

        setFornecedor(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: 'Erro ao buscar dados do Fornecedor!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/fornecedores');
      }
    }

    loadFornecedor();

    return () => {
      controller.abort();
    };
  }, [id, navigate, toast]);

  const handleSubmit = useCallback(
    async (fornecedor) => {
      try {
        await httpClient.patch(`/fornecedores/${id}`, fornecedor);
        toast({
          title: 'Fornecedor editado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/Fornecedores');
      } catch (err) {
        toast({
          title: 'Erro ao editar Fornecedor!',
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
        <Heading marginBottom={8}>Editar fornecedor</Heading>
        <FornecedorForm
          onSubmit={handleSubmit}
          Fornecedor={fornecedor}
          key={fornecedor?.id}
          />
      </Box>
    </Box>
  );
}
