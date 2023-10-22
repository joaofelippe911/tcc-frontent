import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useAuthContext } from '../../contexts/AuthContext';
import TableRowActions from '../../components/TableRowActions';

export default function Colaborador() {
  const [isLoading, setIsLoading] = useState(false);
  const [colaborador, setColaborador] = useState([]);
  const [isDeleteColaboradorModalVisible, setIsDeleteColaboradorModalVisible] =
    useState(false);
  const [colaboradorBeingDeleted, setColaboradorBeingDelete] = useState();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthContext();

  const canAdd = useMemo(() => {
    const hasPermission = user.funcao.permissoes.find(permission => permission.nome === 'colaborador-store');

    return Boolean(hasPermission);
  }, [user]);

  const canView = useMemo(() => {
    const hasPermission = user.funcao.permissoes.find(permission => permission.nome === 'colaborador-show');

    return Boolean(hasPermission);
  }, [user]);

  const canDelete = useMemo(() => {
    const hasPermission = user.funcao.permissoes.find(permission => permission.nome === 'colaborador-destroy');

    return Boolean(hasPermission);
  }, [user]);

  const handleClickEditColaborador = useCallback(
    (id) => {
      if (!canView) {
        return;
      }

      navigate(`/colaboradores/editar/${id}`);
    },
    [canView, navigate]
  );

  const handleClickDeleteColaborador = useCallback((colaborador) => {
    if (!canDelete) {
      return;
    }

    setColaboradorBeingDelete(colaborador);
    setIsDeleteColaboradorModalVisible(true);
  }, [canDelete]);

  const handleConfirmDeleteColaborador = useCallback(async () => {
    try {
      setIsLoadingDelete(true);
      await httpClient.delete(`/colaboradores/${colaboradorBeingDeleted?.id}`);

      setColaborador((prevState) =>
        prevState.filter(
          (colaborador) => colaborador.id !== colaboradorBeingDeleted?.id
        )
      );

      setIsDeleteColaboradorModalVisible(false);
      setColaboradorBeingDelete(undefined);
      setIsLoadingDelete(false);

      toast({
        title: 'Colaborador deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      setIsLoadingDelete(false);

      toast({
        title: err.response.data.message || 'Erro ao deletar colaborador!',
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
          title: err.response.data.message || 'Erro ao buscar os colaboradores!',
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
          <Button
            isDisabled={!canAdd}
            onClick={() => navigate('/colaboradores/adicionar')}
          >
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
                      <TableRowActions
                        canView={canView}
                        canDelete={canDelete}
                        onClickView={() => handleClickEditColaborador(colaborador.id)}
                        onClickDelete={() => handleClickDeleteColaborador(colaborador)}
                      />
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
          isSubmiting={isLoadingDelete}
        />
      </Box>
    </Box>
  );
}
