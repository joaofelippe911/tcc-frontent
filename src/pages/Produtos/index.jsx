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

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [isDeleteProdutoModalVisible, setIsDeleteProdutoModalVisible] =
    useState(false);
  const [produtoBeingDeleted, setProdutoBeingDelete] = useState();

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditProduto = useCallback(
    (id) => {
      navigate(`/produtos/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteProduto = useCallback((produto) => {
    setProdutoBeingDelete(Produtos);
    setIsDeleteProdutoModalVisible(true);
  }, []);

  const handleConfirmDeleteProduto = useCallback(async () => {
    try {
      await httpClient.delete(`/produtos/${produtoBeingDeleted?.id}`);

      setProdutos((prevState) =>
        prevState.filter((produto) => produto.id !== produtoBeingDeleted?.id)
      );

      setIsDeleteProdutoModalVisible(false);
      setProdutoBeingDelete(undefined);

      toast({
        title: 'Produto deletado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      toast({
        title: 'Erro ao deletar Produto!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [produtoBeingDeleted, toast]);

  const handleClickCancelDeleteProduto = useCallback(() => {
    setIsDeleteProdutoModalVisible(false);
    setProdutoBeingDelete(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProdutos() {
      try {
        const { data } = await httpClient.get('/produtos', {
          signal: controller.signal,
        });

        setProdutos(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: 'Erro ao buscar os Produtos!',
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
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Heading>Produtos</Heading>
        <Button onClick={() => navigate('/produtos/adicionar')}>
          Adicionar Produtos
        </Button>
      </Box>
      <TableContainer marginTop={16}>
        <Table variant="simple">
          <TableCaption>Produtos cadastrados</TableCaption>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Valor</Th>
              <Th>Estoque</Th>
              <Th>Imagem</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {produtos.map((produto) => (
              <Tr key={produto.id}>
                <Td>{produto.nome}</Td>
                <Td>{produto.valor}</Td>
                <Td>{produto.estoque}</Td>
                <Td>
                  <Flex>
                    <FiEdit
                      fontSize={20}
                      color="#ED64A6"
                      cursor="pointer"
                      onClick={() => handleClickEditProduto(produto.id)}
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <FiTrash
                      fontSize={20}
                      color="#FC5050"
                      cursor="pointer"
                      onClick={() => handleClickDeleteProduto(produtos)}
                    />
                  </Flex>
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
      />
    </Box>
  );
}
