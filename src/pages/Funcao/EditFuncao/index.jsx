import { Box, Heading, useToast } from '@chakra-ui/react';
import { FuncaoFormForm } from '../components/FuncaoForm';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

export default function EditFuncao() {
  const [funcao, setFuncao] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadFuncao() {
      try {
        const { data } = await httpClient.get(`/funcao/${id}`, {
          signal: controller.signal,
        });

        setFuncao(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: 'Erro ao buscar funçãp!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/funcao');
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
        await httpClient.patch(`/funcao/${id}`, funcao);
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
    <Box>
      <Heading marginBottom={8}>Editar Funcao</Heading>
      <funcaoForm
        onSubmit={handleSubmit}
        funcao={funcao}
        key={funcao?.id}
        />
    </Box>
  );
}
