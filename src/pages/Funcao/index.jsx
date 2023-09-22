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

export default function Funcao() {
  const [funcao, setFuncao] = useState([]);
  const [isDeleteClienteModalVisible, setIsDeleteClienteModalVisible] =
    useState(false);
  const [funcaoBeingDeleted, setFuncaoBeingDelete] = useState();

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditFuncao = useCallback(
    (id) => {
      navigate(`/funcao/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteFuncao = useCallback((funcao) => {
    setFuncaoBeingDelete(funcao);
    setIsDeleteClienteModalVisible(true);
  }, []);

  const handleConfirmDeleteFuncao = useCallback(async () => {
    try {
      await httpClient.delete(`/funcaos/${funcaoBeingDeleted?.id}`);

      setFuncao((prevState) =>
        prevState.filter((funcao) => funcao.id !== funcaoBeingDeleted?.id));

   
      setFuncaoBeingDelete(undefined);

      toast({
        title: 'Função deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
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
  
    setFuncaoBeingDelete(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFuncao() {
      try {
        const { data } = await httpClient.get('/funcaos', {
          signal: controller.signal,
        });

        setFuncao(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: 'Erro ao buscar Funcao!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadFuncao();

    return () => {
      controller.abort();
    };
  }, [toast]);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Heading>Funcao</Heading>
        <Button onClick={() => navigate('/funcao/adicionar')}>
          Adicionar Função
        </Button>
      </Box>
      <TableContainer marginTop={16}>
        <Table variant="simple">
          <TableCaption>funções cadastradas</TableCaption>
          <Thead>
            <Tr>
              <Th>Nome</Th>
            </Tr>
          </Thead>
          <Tbody>
            {funcao.map((funcao) => (
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
 
        title={`Deseja realmente deletar "${funcaoBeingDeleted?.nome}"`}
        onConfirm={handleConfirmDeleteFuncao}
        confirmText="Deletar"
        onCancel={handleClickCancelDeleteFuncao}
      />
    </Box>
  );
}
