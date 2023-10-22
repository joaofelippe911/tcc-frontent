import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import useErrors from '../../../hooks/useErrors';
import isEmailValid from '../../../utils/isEmailValid';
import { formatCpf } from '../../../utils/formatCpf';
import { onlyNumbers } from '../../../utils/onlyNumbers';
import formatPhone from '../../../utils/formatPhone';
import { useAuthContext } from '../../../contexts/AuthContext';

export function ClienteForm({ onSubmit, cliente = undefined }) {
  const [nome, setNome] = useState(cliente?.nome || '');
  const [email, setEmail] = useState(cliente?.email || '');
  const [endereco, setEndereco] = useState(cliente?.endereco || '');
  const [cpf, setCpf] = useState(cliente?.cpf ? formatCpf(cliente.cpf) : '');
  const [telefone, setTelefone] = useState(cliente?.telefone ? formatPhone(cliente.telefone) : '');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { user } = useAuthContext();

  const canEdit = useMemo(() => {
    if (!cliente) {
      return true;
    }

    const hasPermission = user.funcao.permissoes.find(permission => permission.nome === 'cliente-update');

    return Boolean(hasPermission);
  }, [cliente, user]);

  const { setError, removeError, errors, getErrorMessageByFieldName } =
    useErrors();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        nome,
        email,
        endereco,
        cpf: onlyNumbers(cpf),
        telefone: onlyNumbers(telefone),
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome, email, endereco, cpf, telefone]
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

  const handleEmailChange = useCallback(
    (e) => {
      setEmail(e.target.value);

      if (!e.target.value) {
        setError({ field: 'email', message: 'Email é obrigatório!' });
        return;
      }

      if (!isEmailValid(e.target.value)) {
        setError({ field: 'email', message: 'Email inválido!' });
        return;
      }

      removeError('email');
    },
    [setError, removeError]
  );

  const handleEnderecoChange = useCallback(
    (e) => {
      setEndereco(e.target.value);

      if (!e.target.value) {
        setError({ field: 'endereco', message: 'Endereço é obrigatório!' });
        return;
      }

      removeError('endereco');
    },
    [setError, removeError]
  );

  const handleCpfChange = useCallback(
    (e) => {
      setCpf(formatCpf(e.target.value));

      if (!e.target.value) {
        setError({ field: 'cpf', message: 'CPF é obrigatório!' });
        return;
      }

      if (onlyNumbers(e.target.value).length < 11) {
        setError({ field: 'cpf', message: 'CPF inválido!' });
        return;
      }

      removeError('cpf');
    },
    [setError, removeError]
  );

  const handleTelefoneChange = useCallback(
    (e) => {
      setTelefone(formatPhone(e.target.value));

      if (!e.target.value) {
        setError({ field: 'telefone', message: 'Telefone é obrigatório!' });
        return;
      }

      if (onlyNumbers(e.target.value).length < 11) {
        setError({ field: 'telefone', message: 'Telefone inválido!' });
        return;
      }

      removeError('telefone');
    },
    [setError, removeError]
  );

  const isFormValid =
    nome && email && endereco && cpf && telefone && errors.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={Boolean(getErrorMessageByFieldName('nome'))}>
        <FormLabel>Nome completo</FormLabel>
        <Input
          type="text"
          name="nome"
          value={nome}
          onChange={handleNomeChange}
          placeholder="Digite o nome completo do cliente"
        />
        {Boolean(getErrorMessageByFieldName('nome')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('nome')}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
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
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName('endereco'))}
      >
        <FormLabel>Endereço</FormLabel>
        <Input
          type="text"
          name="endereco"
          value={endereco}
          onChange={handleEnderecoChange}
          placeholder="Digite o endereço completo do cliente"
        />
        {Boolean(getErrorMessageByFieldName('endereco')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('endereco')}
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
          placeholder="Digite o CPF do cliente"
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
          placeholder="Digite o telefone do cliente"
          maxLength={15}
        />
        {Boolean(getErrorMessageByFieldName('telefone')) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName('telefone')}
          </FormErrorMessage>
        )}
      </FormControl>

      <Button
        width="full"
        mt={4}
        type="submit"
        isDisabled={isSubmiting || !isFormValid || !canEdit}
        isLoading={isSubmiting}
      >
        Salvar
      </Button>
    </form>
  );
}

  /* <FormControl mt={6}>
    <FormLabel>Senha</FormLabel>
    <Input type="password" placeholder="********" />
</FormControl> */
