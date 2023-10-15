import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import useErrors from '../../../hooks/useErrors';
import { httpClient } from '../../../services/HttpClient';
import { Select } from 'chakra-react-select';
import { AxiosError } from 'axios';

export function FuncaoForm({ onSubmit, funcao = undefined }) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [nome, setNome] = useState(funcao?.nome || '');
  const [permissoes, setPermissoes] = useState(
    funcao?.permissoes
      ? funcao?.permissoes.map((permissao) => ({
          label: permissao.descricao,
          value: permissao.id,
        }))
      : []
  );
  const [isLoadingPermissoes, setIsLoadingPermissoes] = useState(false);
  const [allPermissoes, setAllPermissoes] = useState([]);

  const {
    setError,
    removeError,
    errors,
    getErrorMessageByFieldName
  } = useErrors();

  const toast = useToast();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        nome,
        permissoes: permissoes.map((p) => p.value),
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome, permissoes]
  );

  const handleNomeChange = useCallback(
    (e) => {
      setNome(e.target.value);

      if (!e.target.value) {
        setError({ field: 'nome', message: 'Nome é obrigatório!' });
        return;
      }

      removeError('nome');
    },
    [setError, removeError]
  );

  const handlePermissoesChange = useCallback((e) => {
    setPermissoes(e);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadPermissoes() {
      try {
        setIsLoadingPermissoes(true);

        const { data } = await httpClient.get('/permissoes', {
          signal: controller.signal,
        });

        setAllPermissoes(data);
        setIsLoadingPermissoes(false);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        setIsLoadingPermissoes(false);
        toast({
          title: err.response.data.message || 'Erro ao carregar permissões!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadPermissoes();

    return () => {
      controller.abort();
    };
  }, [toast]);

  const isFormValid = nome && errors.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={Boolean(getErrorMessageByFieldName('nome'))}>
        <FormLabel>Nome</FormLabel>
        <Input
          type="text"
          name="nome"
          value={nome}
          onChange={handleNomeChange}
          placeholder="Digite o nome da função"
        />
        {Boolean(getErrorMessageByFieldName('nome')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('nome')}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName('permissoes'))}
      >
        <FormLabel>Permissões</FormLabel>
        <Select
          isMulti
          isLoading={isLoadingPermissoes}
          closeMenuOnSelect={false}
          value={permissoes}
          onChange={handlePermissoesChange}
          options={allPermissoes.map((permissao) => ({
            label: permissao.descricao,
            value: permissao.id,
          }))}
          placeholder="Selecione as permissões"
        />
        {Boolean(getErrorMessageByFieldName('permissoes')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('permissoes')}
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
