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
import { formatValor } from '../../utils/formatValor';
import TableRowActions from '../../components/TableRowActions';
import ListPageHeader from '../../components/ListPageHeader';

export default function Produtos() {
  const [isLoading, setIsLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [isDeleteProdutoModalVisible, setIsDeleteProdutoModalVisible] = useState(false);
  const [produtoBeingDeleted, setProdutoBeingDeleted] = useState();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditProduto = useCallback(
    (id) => {
      navigate(`/produtos/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteProduto = useCallback((produto) => {
    setProdutoBeingDeleted(produto);
    setIsDeleteProdutoModalVisible(true);
  }, []);

  const handleConfirmDeleteProduto = useCallback(async () => {
    try {
      setIsLoadingDelete(true);
      await httpClient.delete(`/produtos/${produtoBeingDeleted?.id}`);

      setProdutos((prevState) =>
        prevState.filter((produto) => produto.id !== produtoBeingDeleted?.id)
      );

      setIsDeleteProdutoModalVisible(false);
      setProdutoBeingDeleted(undefined);
      setIsLoadingDelete(false);

      toast({
        title: 'Produto deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      setIsLoadingDelete(false);
      toast({
        title: err.response.data.message || 'Erro ao deletar produto!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [produtoBeingDeleted, toast]);

  const handleClickCancelDeleteProduto = useCallback(() => {
    setIsDeleteProdutoModalVisible(false);
    setProdutoBeingDeleted(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProdutos() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get('/produtos', {
          signal: controller.signal,
        });

        setProdutos(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: err.response.data.message || 'Erro ao buscar os produtos!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadProdutos();

    return () => {
      controller.abort();
    };
  }, [toast]);
  
  return (
    <Box position="relative">
      <Spinner spinning={isLoading} />
      <Box p={4}>
        <ListPageHeader
          model="produto"
          title="Produtos"
          ButtonLabel="Adicionar produto"
          onClickButton={() => navigate('/produtos/adicionar')}
        />
        <TableContainer marginTop={16}>
          <Table variant="simple">
            <TableCaption>Produtos cadastrados</TableCaption>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Valor</Th>
                <Th>Estoque</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {produtos.map((produto) => (
                <Tr key={produto.id}>
                  <Td>{produto.nome}</Td>
                  <Td>{formatValor(produto.valor.toFixed(2).toString())}</Td>
                  <Td>{produto.estoque}</Td>
                  <Td>
                    <TableRowActions
                      model="produto"
                      onClickView={() => handleClickEditProduto(produto.id)}
                      onClickDelete={() => handleClickDeleteProduto(produto)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal
          open={isDeleteProdutoModalVisible}
          title={`Deseja realmente deletar "${produtoBeingDeleted?.nome}"`}
          onConfirm={handleConfirmDeleteProduto}
          confirmText="Deletar"
          onCancel={handleClickCancelDeleteProduto}
          isSubmiting={isLoadingDelete}
        />
      </Box>
    </Box>
  );
}
