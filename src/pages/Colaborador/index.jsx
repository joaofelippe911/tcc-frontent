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

export default function Colaborador() {
  const [isLoading, setIsLoading] = useState(false);
  const [colaborador, setColaborador] = useState([]);
  const [isDeleteColaboradorModalVisible, setIsDeleteColaboradorModalVisible] =
    useState(false);
  const [colaboradorBeingDeleted, setColaboradorBeingDelete] = useState();

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditColaborador = useCallback(
    (id) => {
      navigate(`/colaborador/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteColaborador = useCallback((colaborador) => {
    setColaboradorBeingDelete(colaborador);
    setIsDeleteColaboradorModalVisible(true);
  }, []);

  const handleConfirmDeleteColaborador = useCallback(async () => {
    try {
      await httpClient.delete(`/colaboradores/${colaboradorBeingDeleted?.id}`);

      setColaborador((prevState) =>
        prevState.filter(
          (colaborador) => colaborador.id !== colaboradorBeingDeleted?.id
        )
      );

      setIsDeleteColaboradorModalVisible(false);
      setColaboradorBeingDelete(undefined);

      toast({
        title: 'colaborador deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      toast({
        title: 'Erro ao deletar colaborador!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [colaboradorBeingDeleted, toast]);

  const handleClickCancelDeleteColaborador = useCallback(() => {
    setIsDeleteColaboradorModalVisible(false);
    setColaboradorBeingDelete(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadColaboradores() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get('/colaboradores', {
          signal: controller.signal,
        });

        setColaborador(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: 'Erro ao buscar os colaborador!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadColaboradores();

    return () => {
      controller.abort();
    };
  }, [toast]);

  return (
    <Box position="relative">
      <Spinner spinning={isLoading} />
      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Heading>Colaboradores</Heading>
          <Button onClick={() => navigate('/colaborador/adicionar')}>
            Adicionar colaborador
          </Button>
        </Box>
        <TableContainer marginTop={16}>
          <Table variant="simple">
            <TableCaption>Colaboradores cadastrados</TableCaption>
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
              {colaborador.map((colaborador) => (
                <Tr key={colaborador.id}>
                  <Td>{colaborador.nome}</Td>
                  <Td>{colaborador.email}</Td>
                  <Td>{formatCpf(colaborador.cpf)}</Td>
                  <Td>{formatPhone(colaborador.telefone)}</Td>
                  <Td>
                    <Flex>
                      <FiEdit
                        fontSize={20}
                        color="#ED64A6"
                        cursor="pointer"
                        onClick={() =>
                          handleClickEditColaborador(colaborador.id)
                        }
                        style={{
                          marginRight: 8,
                        }}
                      />
                      <FiTrash
                        fontSize={20}
                        color="#FC5050"
                        cursor="pointer"
                        onClick={() =>
                          handleClickDeleteColaborador(colaborador)
                        }
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal
          open={isDeleteColaboradorModalVisible}
          title={`Deseja realmente deletar "${colaboradorBeingDeleted?.nome}"`}
          onConfirm={handleConfirmDeleteColaborador}
          confirmText="Deletar"
          onCancel={handleClickCancelDeleteColaborador}
        />
      </Box>
    </Box>
  );
}
