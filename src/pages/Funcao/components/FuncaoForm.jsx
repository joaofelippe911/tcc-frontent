import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import useErrors from '../../../hooks/useErrors';
import { httpClient } from '../../../services/HttpClient';

export function FuncaoForm({ onSubmit, funcao = undefined }) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [nome, setNome] = useState(funcao?.nome || '');
  const [isLoadingPermissoes, setIsLoadingPermissoes] = useState(false);
  const [permissoes, setPermissoes] = useState([]);

  const { setError, removeError, errors, getErrorMessageByFieldName } =
    useErrors();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        nome,
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome]
  );

  const handleNomeChange = useCallback(
    (e) => {
      setNome(e.target.value);

      if (!e.target.value) {
        setError({ field: 'nome', message: 'Função é obrigatória!' });
        return;
      }

      removeError('nome');
    },
    [setError, removeError]
  );

  useEffect(() => {
    const controller = new AbortController();
    async function loadPermissoes() {
      try {
        setIsLoadingPermissoes(true);

        const { data } = await httpClient.get('/permissoes', { signal: controller.signal });

        setPermissoes(data);

      } catch (error) {

      } finally {
        setIsLoadingPermissoes(false);
      }
    }

    loadPermissoes();

    return () => {
      controller.abort();
    }
  }, []);
  
  const isFormValid =
    nome && errors.length === 0;

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

 
