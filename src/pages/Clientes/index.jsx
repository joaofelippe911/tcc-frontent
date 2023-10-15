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
import formatPhone from '../../utils/formatPhone';
import { formatCpf } from '../../utils/formatCpf';
import { AxiosError } from 'axios';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [isDeleteClienteModalVisible, setIsDeleteClienteModalVisible] =
    useState(false);
  const [clienteBeingDeleted, setClienteBeingDelete] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditCliente = useCallback(
    (id) => {
      navigate(`/clientes/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteCliente = useCallback((cliente) => {
    setClienteBeingDelete(cliente);
    setIsDeleteClienteModalVisible(true);
  }, []);

  const handleConfirmDeleteCliente = useCallback(async () => {
    try {
      setIsLoadingDelete(true);
      await httpClient.delete(`/clientes/${clienteBeingDeleted?.id}`);

      setClientes((prevState) =>
        prevState.filter((cliente) => cliente.id !== clienteBeingDeleted?.id)
      );

      setIsDeleteClienteModalVisible(false);
      setClienteBeingDelete(undefined);

      setIsLoadingDelete(false);
      toast({
        title: 'Cliente deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      setIsLoadingDelete(false);
      toast({
        title: err.response.data.message || 'Erro ao deletar cliente!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [clienteBeingDeleted, toast]);

  const handleClickCancelDeleteCliente = useCallback(() => {
    setIsDeleteClienteModalVisible(false);
    setClienteBeingDelete(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadClientes() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get('/clientes', {
          signal: controller.signal,
        });

        setClientes(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: err.response.data.message || 'Erro ao buscar os clientes!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadClientes();

    return () => {
      controller.abort();
    };
  }, [toast]);

  return (
    <Box position="relative">
      <Spinner spinning={isLoading} />
      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Heading>Clientes</Heading>
          <Button onClick={() => navigate('/clientes/adicionar')}>
            Adicionar cliente
          </Button>
        </Box>
        <TableContainer marginTop={16}>
          <Table variant="simple">
            <TableCaption>Clientes cadastrados</TableCaption>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>CPF</Th>
                <Th>Telefone</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientes.map((cliente) => (
                <Tr key={cliente.id}>
                  <Td>{cliente.nome}</Td>
                  <Td>{cliente.email}</Td>
                  <Td>{formatCpf(cliente.cpf)}</Td>
                  <Td>{formatPhone(cliente.telefone)}</Td>
                  <Td>
                    <Flex>
                      <FiEdit
                        fontSize={20}
                        color="#ED64A6"
                        cursor="pointer"
                        onClick={() => handleClickEditCliente(cliente.id)}
                        style={{
                          marginRight: 8,
                        }}
                      />
                      <FiTrash
                        fontSize={20}
                        color="#FC5050"
                        cursor="pointer"
                        onClick={() => handleClickDeleteCliente(cliente)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal
          open={isDeleteClienteModalVisible}
          title={`Deseja realmente deletar "${clienteBeingDeleted?.nome}"`}
          onConfirm={handleConfirmDeleteCliente}
          confirmText="Deletar"
          onCancel={handleClickCancelDeleteCliente}
          isSubmiting={isLoadingDelete}
        />
      </Box>
    </Box>
  );
}
