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

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [isDeleteClienteModalVisible, setIsDeleteClienteModalVisible] =
    useState(false);
  const [clienteBeingDeleted, setClienteBeingDelete] = useState();

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
      await httpClient.delete(`/clientes/${clienteBeingDeleted?.id}`);

      setClientes((prevState) =>
        prevState.filter((cliente) => cliente.id !== clienteBeingDeleted?.id)
      );

      setIsDeleteClienteModalVisible(false);
      setClienteBeingDelete(undefined);

      toast({
        title: 'Cliente deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      toast({
        title: 'Erro ao deletar cliente!',
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
        const { data } = await httpClient.get('/clientes', {
          signal: controller.signal,
        });

        setClientes(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: 'Erro ao buscar os clientes!',
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
    <Box>
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
      />
    </Box>
  );
}
