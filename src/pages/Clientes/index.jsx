import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
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

import { httpClient } from '../../services/HttpClient';
import formatPhone from '../../utils/formatPhone';
import { formatCpf } from '../../utils/formatCpf';
import { AxiosError } from 'axios';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import TableRowActions from '../../components/TableRowActions';
import ListPageHeader from '../../components/ListPageHeader';

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
        <ListPageHeader
          model="cliente"
          title="Clientes"
          ButtonLabel="Adicionar cliente"
          onClickButton={() => navigate('/clientes/adicionar')}
        />
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
                    <TableRowActions
                      model="cliente"
                      onClickView={() => handleClickEditCliente(cliente.id)}
                      onClickDelete={() => handleClickDeleteCliente(cliente)}
                    />
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
