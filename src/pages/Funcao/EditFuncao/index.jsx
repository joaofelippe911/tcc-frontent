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
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: 'Erro ao buscar função!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/funcao');
      } finally {
        setIsLoading(false);
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
          title: 'funcao editado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/funcao');
      } catch (err) {
        toast({
          title: 'Erro ao editar funcao!',
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
