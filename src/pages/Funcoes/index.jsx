import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { FiEdit, FiTrash } from 'react-icons/fi';

import { httpClient } from '../../services/HttpClient';
import { AxiosError } from 'axios';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

export default function Funcao() {
  const [isLoading, setIsLoading] = useState(false);
  const [funcoes, setFuncoes] = useState([]);
  const [isDeleteFuncaoModalVisible, setIsDeleteFuncaoModalVisible] =
    useState(false);
  const [funcaoBeingDeleted, setFuncaoBeingDelete] = useState();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditFuncao = useCallback(
    (id) => {
      navigate(`/funcoes/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteFuncao = useCallback((funcao) => {
    setFuncaoBeingDelete(funcao);
    setIsDeleteFuncaoModalVisible(true);
  }, []);

  const handleConfirmDeleteFuncao = useCallback(async () => {
    try {
      setIsLoadingDelete(true);
      await httpClient.delete(`/funcoes/${funcaoBeingDeleted?.id}`);

      setFuncoes((prevState) =>
        prevState.filter((funcao) => funcao.id !== funcaoBeingDeleted?.id)
      );

      setIsDeleteFuncaoModalVisible(false);
      setFuncaoBeingDelete(undefined);
      setIsLoadingDelete(false);

      toast({
        title: 'Função deletada com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      setIsLoadingDelete(false);
      toast({
        title: 'Erro ao deletar função!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [funcaoBeingDeleted, toast]);

  const handleClickCancelDeleteFuncao = useCallback(() => {
    setIsDeleteFuncaoModalVisible(false);
    setFuncaoBeingDelete(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFuncoes() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get('/funcoes', {
          signal: controller.signal,
        });

        setFuncoes(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: err.response.data.message || 'Erro ao buscar funções!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
        setIsLoading(false);
      }
    }

    loadFuncoes();

    return () => {
      controller.abort();
    };
  }, [toast]);

  return (
    <Box
      position="relative"
    >
      <Spinner spinning={isLoading} />
      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Heading>Funções</Heading>
          <Button onClick={() => navigate('/funcoes/adicionar')}>
            Adicionar função
          </Button>
        </Box>
        <TableContainer marginTop={16}>
          <Table variant="simple">
            <TableCaption>Funções cadastradas</TableCaption>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {funcoes.map((funcao) => (
                <Tr key={funcao.id}>
                  <Td>{funcao.nome}</Td>
                  <Td>
                    <Flex>
                      <FiEdit
                        fontSize={20}
                        color="#ED64A6"
                        cursor="pointer"
                        onClick={() => handleClickEditFuncao(funcao.id)}
                        style={{
                          marginRight: 8,
                        }}
                      />
                      <FiTrash
                        fontSize={20}
                        color="#FC5050"
                        cursor="pointer"
                        onClick={() => handleClickDeleteFuncao(funcao)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal
          open={isDeleteFuncaoModalVisible}
          title={`Deseja realmente deletar "${funcaoBeingDeleted?.nome}"`}
          onConfirm={handleConfirmDeleteFuncao}
          confirmText="Deletar"
          onCancel={handleClickCancelDeleteFuncao}
          isSubmiting={isLoadingDelete}
        />
      </Box>
    </Box>
  );
}
