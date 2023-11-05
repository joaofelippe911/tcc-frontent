import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  ScaleFade,
  Select,
  Stack,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import useErrors from '../../../hooks/useErrors';
import { httpClient } from '../../../services/HttpClient';
import { AxiosError } from 'axios';
import { formatValor } from '../../../utils/formatValor';
import { FiMinusSquare, FiPlusSquare, FiX } from 'react-icons/fi';
import { onlyNumbers } from '../../../utils/onlyNumbers';
import { formatValorPorcentagem } from '../../../utils/formatValorPorcentagem';

function mapProdutos(produtos) {
  return produtos.map((produto) => ({
    ...produto,
    quantidade: produto.pivot.quantidade,
  }));
}

export function VendaForm({ onSubmit, venda = undefined }) {
  const [cliente, setCliente] = useState(venda?.cliente_id || '');
  const [metodoPagamento, setMetodoPagamento] = useState(
    venda?.metodo_pagamento || ''
  );
  const [desconto, setDesconto] = useState(
    venda?.desconto ? formatValor(venda.desconto.toFixed(2).toString()) : ''
  );
  const [tipoDesconto, setTipoDesconto] = useState('VALOR');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [metodosPagamento, setMetodosPagamento] = useState([]);
  const [produtosAdicionados, setProdutosAdicionados] = useState(
    venda?.produtos ? mapProdutos(venda.produtos) : []
  );
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [isLoadingMetodosPagamento, setIsLoadingMetodosPagamento] =
    useState(false);
  const [indexProdutosBeingHighlighted, setIndexProdutosBeingHighlighted] =
    useState([]);

  const toast = useToast();
  const { setError, removeError, errors, getErrorMessageByFieldName } =
    useErrors();

  const handleClickAddProduto = useCallback(() => {
    setProdutosAdicionados((prevState) => [
      ...prevState,
      {
        id: undefined,
        quantidade: 1,
        valor: 0,
      },
    ]);
  }, []);

  const highlightProduto = useCallback((index) => {
    setIndexProdutosBeingHighlighted((prevState) => [...prevState, index]);

    setTimeout(() => {
      setIndexProdutosBeingHighlighted((prevState) =>
        prevState.filter((i) => i !== index)
      );
    }, 3000);
  }, []);

  const handleClienteChange = useCallback(
    (e) => {
      setCliente(e.target.value);

      if (!e.target.value) {
        setError({ field: 'cliente', message: 'Cliente é obrigatório!' });
        return;
      }

      removeError('cliente');
    },
    [setError, removeError]
  );

  const handleMetodoPagamentoChange = useCallback(
    (e) => {
      setMetodoPagamento(e.target.value);

      if (!e.target.value) {
        setError({
          field: 'metodo_pagamento',
          message: 'Método de pagamento é obrigatório!',
        });
        return;
      }

      removeError('metodo_pagamento');
    },
    [setError, removeError]
  );

  const valorTotal = useMemo(() => {
    let valor = 0;

    produtosAdicionados.forEach(
      (produto) => (valor += produto.valor * produto.quantidade)
    );

    return valor;
  }, [produtosAdicionados]);

  const handleDescontoChange = useCallback(
    (e) => {
      if (tipoDesconto === 'PORCENTAGEM') {
        setDesconto(formatValorPorcentagem(e.target.value));
        return;
      }

      setDesconto(formatValor(e.target.value));
      if (Number(onlyNumbers(e.target.value)) / 100 > valorTotal) {
        setError({
          field: 'desconto',
          message:
            'Valor do desconto não pode ser maior que o valor total da venda!',
        });
        return;
      }

      removeError('desconto');
    },
    [tipoDesconto, valorTotal, setError, removeError]
  );

  const handleTipoDescontoChange = useCallback((e) => {
    setTipoDesconto(e);
    setDesconto('');
    removeError('desconto');
  }, [removeError]);

  const handleProdutoQuantidadeChange = useCallback((e, produtoIndex) => {
    setProdutosAdicionados((prevState) => {
      const newProdutosAdicionados = prevState.map((produto, index) => {
        if (index === produtoIndex) {
          return {
            ...produto,
            quantidade: onlyNumbers(e.target.value),
          };
        }

        return produto;
      });

      return newProdutosAdicionados;
    });
  }, []);

  const handleClickAddOneToQuantidade = useCallback((produtoIndex) => {
    setProdutosAdicionados((prevState) => {
      const newProdutosAdicionados = prevState.map((produto, index) => {
        if (index === produtoIndex) {
          return {
            ...produto,
            quantidade: Number(produto.quantidade) + 1,
          };
        }

        return produto;
      });

      return newProdutosAdicionados;
    });
  }, []);

  const handleClickRemoveOneFromQuantidade = useCallback((produtoIndex) => {
    setProdutosAdicionados((prevState) => {
      const newProdutosAdicionados = prevState.map((produto, index) => {
        if (index === produtoIndex) {
          return {
            ...produto,
            quantidade:
              Number(produto.quantidade) > 1
                ? Number(produto.quantidade) - 1
                : 1,
          };
        }

        return produto;
      });

      return newProdutosAdicionados;
    });
  }, []);

  const handleProdutoIdChange = useCallback(
    (e, produtoIndex) => {
      if (!e.target.value) {
        return;
      }

      const numberId = Number(e.target.value);

      setProdutosAdicionados((prevState) => {
        const produtoAlreadyExists = prevState.find(
          (produto) => produto.id === numberId
        );

        if (produtoAlreadyExists) {
          const existingIndex = prevState.findIndex(
            (produto) => produto.id === produtoAlreadyExists.id
          );
          highlightProduto(
            existingIndex < produtoIndex ? existingIndex : existingIndex - 1
          );
          return prevState.filter((p, index) => index !== produtoIndex);
        }

        const newProdutosAdicionados = prevState.map((produto, index) => {
          const newObject = Object.assign({}, produto);

          const valorProduto = produtos.find((p) => p.id === numberId)?.valor;

          if (index === produtoIndex) {
            return {
              ...newObject,
              id: numberId,
              valor: valorProduto,
            };
          }

          return newObject;
        });

        return newProdutosAdicionados;
      });
    },
    [highlightProduto, produtos]
  );

  const handleClickRemoveProduto = useCallback((produtoIndex) => {
    setProdutosAdicionados((prevState) =>
      prevState.filter((produto, index) => index !== produtoIndex)
    );
  }, []);

  const produtosAdicionadosValidos = useMemo(() => {
    return produtosAdicionados.filter((produto) => Boolean(produto.id));
  }, [produtosAdicionados]);

  const valorComDesconto = useMemo(() => {
    if (!desconto) {
      return valorTotal;
    }

    const descontoSemFormatacao = Number(onlyNumbers(desconto)) / 100;

    if (tipoDesconto === "PORCENTAGEM") {
      return (1 - descontoSemFormatacao) * valorTotal; 
    }

    return valorTotal - descontoSemFormatacao;
  }, [valorTotal, tipoDesconto, desconto]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        cliente_id: cliente,
        produtos: produtosAdicionadosValidos,
        valor_total: valorComDesconto,
        desconto: valorTotal - valorComDesconto,
        metodo_pagamento: metodoPagamento,
      });

      setIsSubmiting(false);
    },
    [onSubmit, cliente, produtosAdicionadosValidos, valorTotal, metodoPagamento, valorComDesconto]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadClientes() {
      try {
        setIsLoadingClientes(true);
        const { data } = await httpClient.get('/clientes', { signal: controller.signal });

        setClientes(data);
        setIsLoadingClientes(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoadingClientes(false);
        toast({
          title: err.response.data.message || 'Erro ao carregar clientes!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    async function loadProdutos() {
      try {
        setIsLoadingProdutos(true);
        const { data } = await httpClient.get('/produtos', { signal: controller.signal });

        setProdutos(data);
        setIsLoadingProdutos(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoadingProdutos(false);
        toast({
          title: err.response.data.message || 'Erro ao carregar produtos!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    async function loadMetodosPagameto() {
      try {
        setIsLoadingMetodosPagamento(true);
        const { data } = await httpClient.get('/metodos_pagamento', { signal: controller.signal });

        setMetodosPagamento(data);
        setIsLoadingMetodosPagamento(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoadingMetodosPagamento(false);
        toast({
          title:
            err.response.data.message ||
            'Erro ao carregar métodos de pagamento!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadClientes();
    loadProdutos();
    loadMetodosPagameto();

    return () => {
      controller.abort();
    }
  }, [toast]);

  const isFormValid =
    cliente &&
    metodoPagamento &&
    produtosAdicionadosValidos.length > 0 &&
    errors.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName('cliente'))}
      >
        <FormLabel>Cliente</FormLabel>
        <Select
          placeholder="Selecione o cliente"
          onChange={handleClienteChange}
          value={cliente}
          _loading={isLoadingClientes}
        >
          {clientes.map((cliente) => (
            <option value={cliente.id} key={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </Select>
        {Boolean(getErrorMessageByFieldName('cliente')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('cliente')}
          </FormErrorMessage>
        )}
      </FormControl>

      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg="#1d202b" px='4'>
          <Heading as="h4" size="md">
            Produtos
          </Heading>
        </AbsoluteCenter>
      </Box>

      <TableContainer marginTop={4}>
        <Table variant="simple">
          <TableCaption>
            <Button onClick={handleClickAddProduto} variant="ghost">
              Adicionar produto
            </Button>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Valor Unidade</Th>
              <Th>Quantidade</Th>
              <Th>Sub Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {produtosAdicionados.map((produto, index) => {
              const produtoData = produtos.find(
                (p) => p.id === Number(produto.id)
              );

              const totalValue =
                (produtoData?.valor || 0) * Number(produto.quantidade);
              const isBeingHighlighted =
                indexProdutosBeingHighlighted.includes(index);

              return (
                <Tr
                  key={`produto-${index}`}
                  borderBottom="1px"
                  borderBottomColor="#2D3748"
                  backgroundColor={isBeingHighlighted ? '#ED64A6' : undefined}
                  transition="all .4s"
                >
                  <Td borderBottom="0">
                    <ScaleFade initialScale={0.5} in={true}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <FiX
                          fontSize={20}
                          color={isBeingHighlighted ? '#FFFFFF' : '#FC5050'}
                          cursor={'pointer'}
                          onClick={() => handleClickRemoveProduto(index)}
                          style={{
                            marginRight: 8,
                          }}
                        />
                        <Select
                          placeholder="Selecione o produto"
                          onChange={(e) => handleProdutoIdChange(e, index)}
                          value={produto.id || ''}
                          _loading={isLoadingProdutos}
                          disabled={produto.id || ''}
                          key={`select-produto-${produto.id}`}
                        >
                          {produtos.map((p) => (
                            <option value={p.id} key={p.id}>
                              {p.nome}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </ScaleFade>
                  </Td>
                  <Td>
                    <ScaleFade initialScale={0.5} in={true}>
                      {formatValor(produtoData?.valor.toFixed(2).toString()) ||
                        'R$ 0,00'}
                    </ScaleFade>
                  </Td>
                  <Td borderBottom="0">
                    <ScaleFade initialScale={0.5} in={true}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          variant="unstyled"
                          padding="0"
                          minWidth={0}
                          marginRight={2}
                        >
                          <FiMinusSquare
                            fontSize={20}
                            color={isBeingHighlighted ? '#FFFFFF' : '#8FACC0'}
                            cursor={'pointer'}
                            onClick={() =>
                              handleClickRemoveOneFromQuantidade(index)
                            }
                          />
                        </Button>
                        <Input
                          type="text"
                          name="quantidade"
                          value={produto.quantidade}
                          onChange={(e) =>
                            handleProdutoQuantidadeChange(e, index)
                          }
                          maxLength={5}
                          borderColor={
                            isBeingHighlighted ? '#FFFFFF' : '#2D3748'
                          }
                          borderBottomColor={
                            isBeingHighlighted ? '#FFFFFF' : '#2D3748'
                          }
                          focusBorderColor={
                            isBeingHighlighted ? '#FFFFFF' : undefined
                          }
                          autoComplete="off"
                          maxWidth="20"
                        />
                        <Button
                          variant="unstyled"
                          padding="0"
                          minWidth={0}
                          marginLeft={2}
                        >
                          <FiPlusSquare
                            fontSize={20}
                            color={isBeingHighlighted ? '#FFFFFF' : '#8FACC0'}
                            cursor={'pointer'}
                            onClick={() => handleClickAddOneToQuantidade(index)}
                          />
                        </Button>
                      </div>
                    </ScaleFade>
                  </Td>
                  <Td>
                    <ScaleFade initialScale={0.5} in={true}>
                      {formatValor(totalValue.toFixed(2).toString())}
                    </ScaleFade>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Stack
        direction={['column', 'row']}
        spacing={2}
        alignItems="center"
      >
        <RadioGroup onChange={handleTipoDescontoChange} value={tipoDesconto}>
          <Stack direction="column">
            <Radio value="PORCENTAGEM">%</Radio>
            <Radio value="VALOR">R$</Radio>
          </Stack>
        </RadioGroup>

        <FormControl
          isInvalid={Boolean(getErrorMessageByFieldName('desconto'))}
        >
          <FormLabel>Desconto</FormLabel>
          <Input
            type="text"
            name="desconto"
            value={desconto}
            onChange={handleDescontoChange}
            placeholder="Digite o desconto"
          />
          {Boolean(getErrorMessageByFieldName('desconto')) && (
            <FormErrorMessage>
              {getErrorMessageByFieldName('desconto')}
            </FormErrorMessage>
          )}
        </FormControl>
      </Stack>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName('metodo_pagamento'))}
      >
        <FormLabel>Método de Pagamento</FormLabel>
        <Select
          placeholder="Selecione o método de pagamento"
          onChange={handleMetodoPagamentoChange}
          value={metodoPagamento}
          _loading={isLoadingMetodosPagamento}
        >
          {metodosPagamento.map((metodo) => (
            <option value={metodo.name} key={metodo.name}>
              {metodo.value}
            </option>
          ))}
        </Select>
        {Boolean(getErrorMessageByFieldName('metodo_pagamento')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('metodo_pagamento')}
          </FormErrorMessage>
        )}
      </FormControl>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        padding={4}
      >
        <Heading as="h4" size="md">
          Valor Total: {formatValor(valorTotal.toFixed(2).toString())}
        </Heading>
        {
          valorComDesconto !== valorTotal && (
          <Heading as="h4" size="md" marginLeft={4} color={valorComDesconto >= 0 ? 'green.600' : 'red.600' }>
            Valor com Desconto: {formatValor((valorComDesconto).toFixed(2).toString())}
          </Heading>
          )
        }
      </Box>

      <Button
        width="full"
        mt={4}
        type="submit"
        isDisabled={isSubmiting || !isFormValid}
        isLoading={isSubmiting}
      >
        Salvar
      </Button>
    </form>
  );
}
