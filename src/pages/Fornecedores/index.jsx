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
import { formatCnpj } from '../../utils/formatCnpj';
import { AxiosError } from 'axios';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [isDeleteFornecedorModalVisible, setIsDeleteFornecedorModalVisible] = useState(false);
  const [fornecedorBeingDeleted, setFornecedorBeingDelete] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditFornecedor = useCallback(
    (id) => {
      navigate(`/fornecedores/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteFornecedor = useCallback((fornecedor) => {
    setFornecedorBeingDelete(fornecedor);
    setIsDeleteFornecedorModalVisible(true);
  }, []);

  const handleConfirmDeleteFornecedor = useCallback(async () => {
    try {
      setIsLoadingDelete(true);
      await httpClient.delete(`/fornecedores/${fornecedorBeingDeleted?.id}`);

      setFornecedores((prevState) =>
        prevState.filter(
          (fornecedor) => fornecedor.id !== fornecedorBeingDeleted?.id
        )
      );

      setIsDeleteFornecedorModalVisible(false);
      setFornecedorBeingDelete(undefined);
      setIsLoadingDelete(false);

      toast({
        title: 'Fornecedor deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      setIsLoadingDelete(false);
      toast({
        title: err.response.data.message || 'Erro ao deletar fornecedor!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [fornecedorBeingDeleted, toast]);

  const handleClickCancelDeleteFornecedor = useCallback(() => {
    setIsDeleteFornecedorModalVisible(false);
    setFornecedorBeingDelete(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFornecedores() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get('/fornecedores', {
          signal: controller.signal,
        });

        setFornecedores(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: err.response.data.message || 'Erro ao buscar os fornecedores!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadFornecedores();

    return () => {
      controller.abort();
    };
  }, [toast]);

  return (
    <Box position="relative">
      <Spinner spinning={isLoading} />
      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Heading>Fornecedores</Heading>
          <Button onClick={() => navigate('/fornecedores/adicionar')}>
            Adicionar fornecedor
          </Button>
        </Box>
        <TableContainer marginTop={16}>
          <Table variant="simple">
            <TableCaption>Fornecedores cadastrados</TableCaption>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>CNPJ</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fornecedores.map((fornecedor) => (
                <Tr key={fornecedor.id}>
                  <Td>{fornecedor.nome}</Td>
                  <Td>{formatCnpj(fornecedor.cnpj)}</Td>
                  <Td>
                    <Flex>
                      <FiEdit
                        fontSize={20}
                        color="#ED64A6"
                        cursor="pointer"
                        onClick={() => handleClickEditFornecedor(fornecedor.id)}
                        style={{
                          marginRight: 8,
                        }}
                      />
                      <FiTrash
                        fontSize={20}
                        color="#FC5050"
                        cursor="pointer"
                        onClick={() => handleClickDeleteFornecedor(fornecedor)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal
          open={isDeleteFornecedorModalVisible}
          title={`Deseja realmente deletar "${fornecedorBeingDeleted?.nome}"`}
          onConfirm={handleConfirmDeleteFornecedor}
          confirmText="Deletar"
          onCancel={handleClickCancelDeleteFornecedor}
          isSubmiting={isLoadingDelete}
        />
      </Box>
    </Box>
  );
}
