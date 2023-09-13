import { Box, Heading, useToast } from '@chakra-ui/react';
import { ColaboradorForm } from '../components/ColaboradorForm';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

export default function EditColaborador() {
  const [colaborador, setColaborador] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadColaborador() {
      try {
        const { data } = await httpClient.get(`/colaborador/${id}`, {
          signal: controller.signal,
        });

        setColaborador(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: 'Erro ao buscar dados do colaborador!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/colaborador');
      }
    }

    loadColaborador();

    return () => {
      controller.abort();
    };
  }, [id, navigate, toast]);

  const handleSubmit = useCallback(
    async (colaborador) => {
      try {
        await httpClient.patch(`/colaborador/${id}`, colaborador);
        toast({
          title: 'Colaborador editado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/colaborador');
      } catch (err) {
        toast({
          title: 'Erro ao editar colaborador!',
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
      <Heading marginBottom={8}>Editar colaborador</Heading>
      <ColaboradorForm
        onSubmit={handleSubmit}
        colaborador={colaborador}
        key={colaborador?.id}
        />
    </Box>
  );
}
