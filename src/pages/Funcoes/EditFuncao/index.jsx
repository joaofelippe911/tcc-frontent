import { Box, Heading, useToast } from '@chakra-ui/react';
import { FuncaoForm } from '../components/FuncaoForm';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import Spinner from '../../../components/Spinner';

export default function EditFuncao() {
  const [isLoading, setIsLoading] = useState(false);
  const [funcao, setFuncao] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadFuncao() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get(`/funcoes/${id}`, {
          signal: controller.signal,
        });

        setFuncao(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: err?.response?.data?.message || 'Erro ao buscar dados da função!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });

        setIsLoading(false);
        navigate('/funcoes');
      }
    }

    loadFuncao();

    return () => {
      controller.abort();
    };
  }, [id, navigate, toast]);

  const handleSubmit = useCallback(
    async (funcao) => {
      try {
        await httpClient.patch(`/funcoes/${id}`, funcao);
        toast({
          title: 'Função editada com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/funcoes');
      } catch (err) {
        toast({
          title: err?.response?.data?.message || 'Erro ao editar função!',
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
        <Heading marginBottom={8}>Editar função</Heading>
        <FuncaoForm onSubmit={handleSubmit} funcao={funcao} key={funcao?.id} />
      </Box>
    </Box>
  );
}
