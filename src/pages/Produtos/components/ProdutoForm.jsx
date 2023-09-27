import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import useErrors from "../../../hooks/useErrors";
import { onlyNumbers } from "../../../utils/onlyNumbers";
import { httpClient } from "../../../services/HttpClient";
import { AxiosError } from "axios";
import  formatValor from "../../../utils/formatValor";



export function ProdutoForm({ onSubmit, produto = undefined }) {
  const [nome, setNome] = useState(produto?.nome || "");
  const [valor, setValor] = useState(produto?.valor ? formatValor(produto.valor) : "");
  const [estoque, setEstoque] = useState(produto?.estoque ? produto.estoque : "");
  const [imagem, setImagem] = useState(produto?.imagem || "");
  // fornecedor
  const [fornecedor_id, setFornecedor] = useState(produto?.fornecedor_id || "");
  const [isSubmiting, setIsSubmiting] = useState(false);
  // fornecedor
  const [fornecedores, setFornecedores] = useState([]);


  const toast = useToast();

  const {
    setError,
    removeError,
    errors,
    getErrorMessageByFieldName,
  } = useErrors();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        nome,
        valor: onlyNumbers(valor),
        estoque,
        imagem,
        fornecedor_id,
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome, valor, estoque, imagem, fornecedor_id]
  );

  const handleNomeChange = useCallback(
    (e) => {
      setNome(e.target.value);

      if (!e.target.value) {
        setError({ field: "nome", message: "Nome é obrigatório!" });
        return;
      }

      removeError("nome");
    },
    [setError, removeError]
  );

  const handleValorChange = useCallback(
    (e) => {
      setValor(formatValor(e.target.value));

      if (!e.target.value) {
        setError({ field: "valor", message: "Valor é obrigatório!" });
        return;
      }

      if (onlyNumbers(e.target.value)) {
        setError({ field: "valor", message: "Valor inválido!" });
        return;
      }

      removeError("valor");
    },
    [setError, removeError]
  );

  const handleEstoqueChange = useCallback(
    (e) => {
      setEstoque((e.target.value));

      if (!e.target.value) {
        setError({ field: "estoque", message: "Estoque é obrigatório!" });
        return;
      }

      if ((e.target.value)) {
        setError({ field: "estoque", message: "Estoque inválido!" });
        return;
      }

      removeError("estoque");
    },
    [setError, removeError]

  );

  // fornecedor
  const handleFornecedorChange = useCallback(
    (e) => {
      setFornecedor(e.target.value);

      if (!e.target.value) {
        setError({ field: "fornecedor", message: "Fornecedor é obrigatório!" });
        return;
      }

      removeError("fornecedor");
    },
    [setError, removeError]
  );

  const handleImagemChange = useCallback(
    (e) => {
      setImagem(e.target.value);

      if (!e.target.value) {
        setError({ field: 'imagem', message: 'Imagem é obrigatório!' });
        return;
      }

      if (e.target.value) {
        setError({ field: 'imagem', message: 'Imagem inválida!' });
        return;
      }

      removeError('imagem');
    },
    [setError, removeError]
  );

 
  useEffect(() => {
    async function loadFornecedores() {
      try {
        const { data } = await httpClient.get('/fornecedores');

        setFornecedores(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: 'Erro ao carregar funções!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadFornecedores();
  }, []);

  const isFormValid = nome && valor && estoque && imagem && fornecedor_id  && errors.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={Boolean(getErrorMessageByFieldName("nome"))}>
        <FormLabel>Nome</FormLabel>
        <Input
          type="text"
          name="nome"
          value={nome}
          onChange={handleNomeChange}
          placeholder="Digite o nome do produto"
        />
        {Boolean(getErrorMessageByFieldName("nome")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("nome")}
          </FormErrorMessage>
        )}
      </FormControl>


      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("valor"))}
      >
        <FormLabel>Valor</FormLabel>
        <Input
          type="number"
          name="valor"
          value={valor}
          onChange={handleValorChange}
          placeholder="Digite o valor do produto"
        />
        {Boolean(getErrorMessageByFieldName("valor")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("valor")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("estoque"))}
      >
        <FormLabel>Estoque</FormLabel>
        <Input
          type="number"
          name="estoque"
          value={estoque}
          onChange={handleEstoqueChange}
          placeholder="Digite a quantidade em estoque do produto"
          maxLength={15}
        />
        {Boolean(getErrorMessageByFieldName("estoque")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("estoque")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("fornecedor"))}
      >
        <FormLabel>Função</FormLabel>
        {/* fornecedor */}
        <Select
          placeholder="Selecione o fornecedor"
          onChange={handleFornecedorChange}
          value={fornecedor_id}
        >
          {
            fornecedores.map((fornecedor) => (
              <option value={fornecedor.id} key={fornecedor.id}>{fornecedor.nome}</option>
            ))
          }
        </Select>
        {Boolean(getErrorMessageByFieldName("fornecedor")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("fornecedor")}
          </FormErrorMessage>
        )}
      </FormControl>


      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName('imagem'))}
      >
        <FormLabel>Imagem</FormLabel>
        <Input
          type="imagem"
          name="imagem"
          value={imagem}
          onChange={handleImagemChange}
          
        />
        {Boolean(getErrorMessageByFieldName('imagem')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('imagem')}
          </FormErrorMessage>
        )}
      </FormControl>

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
