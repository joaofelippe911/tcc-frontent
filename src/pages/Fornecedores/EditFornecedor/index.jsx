import { Box, Heading, useToast } from '@chakra-ui/react';
import { FornecedorForm } from '../components/FornecedorForm';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../../services/HttpClient';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

export default function EditFornecedor() {
  const [fornecedor, setFornecedor] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    async function loadFornecedor() {
      try {
        const { data } = await httpClient.get(`/fornecedores/${id}`, {
          signal: controller.signal,
        });

        setFornecedor(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

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
    <Box>
      <Heading marginBottom={8}>Editar Fornecedor</Heading>
      <FornecedorForm
        onSubmit={handleSubmit}
        Fornecedor={fornecedor}
        key={fornecedor?.id}
        />
    </Box>
  );
}
