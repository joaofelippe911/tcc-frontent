import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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

import { httpClient } from '../../services/HttpClient';
import { AxiosError } from 'axios';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import TableRowActions from '../../components/TableRowActions';
import ListPageHeader from '../../components/ListPageHeader';

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
        title: err.response.data.message || 'Erro ao deletar função!',
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
          title: err.response.data.message || 'Erro ao buscar as funções!',
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
        <ListPageHeader
          model="funcao"
          title="Funções"
          ButtonLabel="Adicionar função"
          onClickButton={() => navigate('/funcoes/adicionar')}
        />
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
                    <TableRowActions
                      model="funcao"
                      onClickView={() => handleClickEditFuncao(funcao.id)}
                      onClickDelete={() => handleClickDeleteFuncao(funcao)}
                    />
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
