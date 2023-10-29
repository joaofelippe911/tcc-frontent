import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ScaleFade,
  Select,
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
import {
  FiMinusSquare,
  FiPlusSquare,
  FiX,
} from 'react-icons/fi';
import { onlyNumbers } from '../../../utils/onlyNumbers';

export function VendaForm({ onSubmit, colaborador: venda = undefined }) {
  // const [nome, setNome] = useState(venda?.nome || '');
  // const [cpf, setCpf] = useState(venda?.cpf ? formatCpf(venda.cpf) : '');
  // const [telefone, setTelefone] = useState(venda?.telefone ? formatPhone(venda.telefone) : '');
  const [cliente_id, setCliente] = useState(venda?.cliente_id || '');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [produtosAdicionados, setProdutosAdicionados] = useState([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [indexProdutosBeingHighlighted, setIndexProdutosBeingHighlighted] =
    useState([]);
  // const [email, setEmail] = useState(venda?.email || '');
  // const [password, setPassowrd] = useState(venda?.password || '');
  // const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

  const toast = useToast();
  const { setError, removeError, errors, getErrorMessageByFieldName } =
    useErrors();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        // nome,
        // cpf: onlyNumbers(cpf),
        // telefone: onlyNumbers(telefone),
        cliente_id,
        // email,
        // password,
      });

      setIsSubmiting(false);
    },
    [onSubmit, cliente_id]
  );

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

  // const handleNomeChange = useCallback(
  //   (e) => {
  //     setNome(e.target.value);

  //     if (!e.target.value) {
  //       setError({ field: 'nome', message: 'Nome é obrigatório!' });
  //       return;
  //     }

  //     removeError('nome');
  //   },
  //   [setError, removeError]
  // );

  // const handleCpfChange = useCallback(
  //   (e) => {
  //     setCpf(formatCpf(e.target.value));

  //     if (!e.target.value) {
  //       setError({ field: 'cpf', message: 'CPF é obrigatório!' });
  //       return;
  //     }

  //     if (onlyNumbers(e.target.value).length < 11) {
  //       setError({ field: 'cpf', message: 'CPF inválido!' });
  //       return;
  //     }

  //     removeError('cpf');
  //   },
  //   [setError, removeError]
  // );

  // const handleTelefoneChange = useCallback(
  //   (e) => {
  //     setTelefone(formatPhone(e.target.value));

  //     if (!e.target.value) {
  //       setError({ field: 'telefone', message: 'Telefone é obrigatório!' });
  //       return;
  //     }

  //     if (onlyNumbers(e.target.value).length < 11) {
  //       setError({ field: 'telefone', message: 'Telefone inválido!' });
  //       return;
  //     }

  //     removeError('telefone');
  //   },
  //   [setError, removeError]
  // );

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

      setProdutosAdicionados((prevState) => {
        const produtoAlreadyExists = prevState.find(
          (produto) => produto.id === e.target.value
        );

        if (produtoAlreadyExists) {
          highlightProduto(
            prevState.findIndex(
              (produto) => produto.id === produtoAlreadyExists.id
            )
          );
          return prevState.filter((p, index) => index !== produtoIndex);
        }

        const newProdutosAdicionados = prevState.map((produto, index) => {
          if (index === produtoIndex) {
            return {
              ...produto,
              id: e.target.value,
            };
          }

          return produto;
        });

        return newProdutosAdicionados;
      });
    },
    [highlightProduto]
  );

  const handleClickRemoveProduto = useCallback((produtoIndex) => {
    setProdutosAdicionados((prevState) =>
      prevState.filter((produto, index) => index !== produtoIndex)
    );
  }, []);

  const produtosAdicionadosValidos = useMemo(() => {
    return produtosAdicionados.filter((produto) => Boolean(produto.id));
  }, [produtosAdicionados]);

  // const handleEmailChange = useCallback(
  //   (e) => {
  //     setEmail(e.target.value);

  //     if (!e.target.value) {
  //       setError({ field: 'email', message: 'Email é obrigatório!' });
  //       return;
  //     }

  //     if (!isEmailValid(e.target.value)) {
  //       setError({ field: 'email', message: 'Email inválido!' });
  //       return;
  //     }

  //     removeError('email');
  //   },
  //   [setError, removeError]
  // );

  // const handlePasswordChange = useCallback(
  //   (e) => {
  //     setPassowrd(e.target.value);

  //     if (!e.target.value) {
  //       setError({ field: 'password', message: 'Senha é obrigatório!' });
  //       return;
  //     }

  //     if (!isPasswordValid(e.target.value)) {
  //       setError({ field: 'password', message: 'A senha precisa ter entre 8 e 20 caracteres, conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial!' });
  //       return;
  //     }

  //     removeError('password');
  //   },
  //   [setError, removeError]
  // );

  useEffect(() => {
    async function loadClientes() {
      try {
        setIsLoadingClientes(true);
        const { data } = await httpClient.get('/clientes');

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
        const { data } = await httpClient.get('/produtos');

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

    loadClientes();
    loadProdutos();
  }, [toast]);

  const isFormValid =
    // nome &&
    // cpf &&
    // telefone &&
    cliente_id &&
    // email &&
    // (venda || password) &&
    produtosAdicionadosValidos.length > 0 &&
    errors.length === 0;

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* <FormControl isInvalid={Boolean(getErrorMessageByFieldName('nome'))}>
          <FormLabel>Nome completo</FormLabel>
          <Input
            type="text"
            name="nome"
            value={nome}
            onChange={handleNomeChange}
            placeholder="Digite o nome completo do colaborador"
          />
          {Boolean(getErrorMessageByFieldName('nome')) && (
            <FormErrorMessage>
              {getErrorMessageByFieldName('nome')}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          marginTop={4}
          isInvalid={Boolean(getErrorMessageByFieldName('cpf'))}
        >
          <FormLabel>CPF</FormLabel>
          <Input
            type="text"
            name="cpf"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="Digite o CPF do colaborador"
          />
          {Boolean(getErrorMessageByFieldName('cpf')) && (
            <FormErrorMessage>
              {getErrorMessageByFieldName('cpf')}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          marginTop={4}
          isInvalid={Boolean(getErrorMessageByFieldName('telefone'))}
        >
          <FormLabel>Telefone</FormLabel>
          <Input
            type="text"
            name="telefone"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="Digite o telefone do colaborador"
            maxLength={15}
          />
          {Boolean(getErrorMessageByFieldName('telefone')) && (
            <FormErrorMessage>
              {getErrorMessageByFieldName('telefone')}
            </FormErrorMessage>
          )}
        </FormControl> */}

        <FormControl
          marginTop={4}
          isInvalid={Boolean(getErrorMessageByFieldName('cliente'))}
        >
          <FormLabel>Cliente</FormLabel>
          <Select
            placeholder="Selecione o cliente"
            onChange={handleClienteChange}
            value={cliente_id}
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

        <TableContainer marginTop={16}>
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
                    key={`produto-${produto.id}-${index}`}
                    borderBottom="1px"
                    borderBottomColor="#2D3748"
                    backgroundColor={isBeingHighlighted ? '#ED64A6' : undefined}
                    transition="all .5"
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
                            value={produto.id}
                            _loading={isLoadingProdutos}
                            disabled={produto.id}
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
                        {formatValor(
                          produtoData?.valor.toFixed(2).toString()
                        ) || 'R$ 0,00'}
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
                              onClick={() =>
                                handleClickAddOneToQuantidade(index)
                              }
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

        {/* <FormControl
          marginTop={4}
          isInvalid={Boolean(getErrorMessageByFieldName('email'))}
        >
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="exemplo@exemplo.com"
          />
          {Boolean(getErrorMessageByFieldName('email')) && (
            <FormErrorMessage>
              {getErrorMessageByFieldName('email')}
            </FormErrorMessage>
          )}
        </FormControl> */}

        {/* {!venda && (
          <FormControl
            marginTop={4}
            isInvalid={Boolean(getErrorMessageByFieldName('password'))}
          >
            <FormLabel>Senha</FormLabel>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Digite uma senha válida"
            />
            {Boolean(getErrorMessageByFieldName('password')) && (
              <FormErrorMessage>
                {getErrorMessageByFieldName('password')}
              </FormErrorMessage>
            )}
          </FormControl>
        )} */}

        {/* {
          venda && (
            <Button
              variant="ghost"
              mt={4}
              type="button"
              isDisabled={isSubmiting}
              onClick={() => setIsChangePasswordModalVisible(true)}
            >
              Alterar senha
            </Button>
          )
        } */}

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
      {/* {
        isChangePasswordModalVisible && (
          <ChangePasswordModal
            onCancel={() => setIsChangePasswordModalVisible(false)}
            colaboradorId={venda?.id}
            afterSubmit={() => setIsChangePasswordModalVisible(false)}
          />
        )
      } */}
    </>
  );
}
