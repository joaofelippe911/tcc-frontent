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
import formatDateStringToDateAndTime from '../../utils/formatDateStringToDateAndTime';

export default function Vendas() {
  const [isLoading, setIsLoading] = useState(false);
  const [vendas, setVendas] = useState([]);
  const [isDeleteVendaModalVisible, setIsDeleteVendaModalVisible] = useState(false);
  const [vendaBeingDeleted, setVendaBeingDeleted] = useState();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleClickEditVenda = useCallback(
    (id) => {
      navigate(`/vendas/editar/${id}`);
    },
    [navigate]
  );

  const handleClickDeleteVenda = useCallback((venda) => {
    setVendaBeingDeleted(venda);
    setIsDeleteVendaModalVisible(true);
  }, []);

  const handleConfirmDeleteVenda = useCallback(async () => {
    try {
      setIsLoadingDelete(true);
      await httpClient.delete(`/vendas/${vendaBeingDeleted?.id}`);

      setVendas((prevState) =>
        prevState.filter((venda) => venda.id !== vendaBeingDeleted?.id)
      );

      setIsDeleteVendaModalVisible(false);
      setVendaBeingDeleted(undefined);
      setIsLoadingDelete(false);

      toast({
        title: 'Venda deletada com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      setIsLoadingDelete(false);
      toast({
        title: err.response.data.message || 'Erro ao deletar venda!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [vendaBeingDeleted, toast]);

  const handleClickCancelDeleteVenda = useCallback(() => {
    setIsDeleteVendaModalVisible(false);
    setVendaBeingDeleted(undefined);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadVendas() {
      try {
        setIsLoading(true);
        const { data } = await httpClient.get('/vendas', {
          signal: controller.signal,
        });

        setVendas(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoading(false);
        toast({
          title: err.response.data.message || 'Erro ao buscar as vendas!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadVendas();

    return () => {
      controller.abort();
    };
  }, [toast]);
  
  return (
    <Box position="relative">
      <Spinner spinning={isLoading} />
      <Box p={4}>
        <ListPageHeader
          model="venda"
          title="Vendas"
          ButtonLabel="Adicionar venda"
          onClickButton={() => navigate('/vendas/adicionar')}
        />
        <TableContainer marginTop={16}>
          <Table variant="simple">
            <TableCaption>Vendas cadastradas</TableCaption>
            <Thead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Desconto</Th>
                <Th>Valor</Th>
                <Th>Quantidade Produtos</Th>
                <Th>Método Pagamento</Th>
                <Th>Data</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {vendas.map((venda) => {
                let quantidadeProdutos = 0;
                
                venda.produtos.forEach((produto) => {
                  quantidadeProdutos += produto.pivot.quantidade;
                });

                return (
                  <Tr key={venda.id}>
                    <Td>{venda.cliente.nome}</Td>
                    <Td>{formatValor(venda.desconto.toFixed(2).toString())}</Td>
                    <Td>{formatValor(venda.valor_total.toFixed(2).toString())}</Td>
                    <Td>{quantidadeProdutos}</Td>
                    <Td>{venda.metodo_pagamento}</Td>
                    <Td>{formatDateStringToDateAndTime(venda.created_at)}</Td>
                    <Td>
                      <TableRowActions
                        model="venda"
                        onClickView={() => handleClickEditVenda(venda.id)}
                        onClickDelete={() => handleClickDeleteVenda(venda)}
                      />
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal
          open={isDeleteVendaModalVisible}
          title={`Deseja realmente deletar a venda realizada para o cliente "${vendaBeingDeleted?.cliente.nome}" no valor de ${formatValor(vendaBeingDeleted?.valor_total?.toFixed(2)?.toString())}?`}
          onConfirm={handleConfirmDeleteVenda}
          confirmText="Deletar"
          onCancel={handleClickCancelDeleteVenda}
          isSubmiting={isLoadingDelete}
        />
      </Box>
    </Box>
  );
}
