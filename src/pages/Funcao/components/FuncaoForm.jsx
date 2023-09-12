import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import useErrors from '../../../hooks/useErrors';

export function FuncaoForm({ onSubmit, funcao = undefined }) {
  const [nome, setNome] = useState(funcao?.nome || '');
  const [isSubmiting, setIsSubmiting] = useState(false);

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

 
