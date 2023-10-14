import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import useErrors from '../../../hooks/useErrors';
import { formatCpf } from '../../../utils/formatCpf';
import { onlyNumbers } from '../../../utils/onlyNumbers';
import formatPhone from '../../../utils/formatPhone';
import { httpClient } from '../../../services/HttpClient';
import { AxiosError } from 'axios';
import isEmailValid from '../../../utils/isEmailValid';
import ChangePasswordModal from './ChangePasswordModal';

export function ColaboradorForm({ onSubmit, colaborador = undefined }) {
  const [nome, setNome] = useState(colaborador?.nome || '');
  const [cpf, setCpf] = useState(colaborador?.cpf ? formatCpf(colaborador.cpf) : '');
  const [telefone, setTelefone] = useState(colaborador?.telefone ? formatPhone(colaborador.telefone) : '');
  const [funcao_id, setFuncao] = useState(colaborador?.funcao_id || '');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [funcoes, setFuncoes] = useState([]);
  const [email, setEmail] = useState(colaborador?.email || '');
  const [password, setPassowrd] = useState(colaborador?.password || '');
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

  const toast = useToast();
  const { setError, removeError, errors, getErrorMessageByFieldName } =
    useErrors();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        nome,
        cpf: onlyNumbers(cpf),
        telefone: onlyNumbers(telefone),
        funcao_id,
        email,
        password,
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome, cpf, telefone, funcao_id, email, password]
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

  // funcao
  const handleFuncaoChange = useCallback(
    (e) => {
      setFuncao(e.target.value);

      if (!e.target.value) {
        setError({ field: 'funcao', message: 'Função é obrigatório!' });
        return;
      }

      removeError('funcao');
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

  const handlePasswordChange = useCallback(
    (e) => {
      setPassowrd(e.target.value);

      if (!e.target.value) {
        setError({ field: 'password', message: 'Senha é obrigatório!' });
        return;
      }

      removeError('password');
    },
    [setError, removeError]
  );

  useEffect(() => {
    async function loadFuncoes() {
      try {
        const { data } = await httpClient.get('/funcoes');

        setFuncoes(data);
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

    loadFuncoes();
  }, [toast]);

  const isFormValid =
    nome &&
    cpf &&
    telefone &&
    funcao_id &&
    email &&
    (colaborador || password) &&
    errors.length === 0;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={Boolean(getErrorMessageByFieldName('nome'))}>
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
        </FormControl>

        <FormControl
          marginTop={4}
          isInvalid={Boolean(getErrorMessageByFieldName('funcao'))}
        >
          <FormLabel>Função</FormLabel>
          {/* funcao */}
          <Select
            placeholder="Selecione a função"
            onChange={handleFuncaoChange}
            value={funcao_id}
          >
            {funcoes.map((funcao) => (
              <option value={funcao.id} key={funcao.id}>
                {funcao.nome}
              </option>
            ))}
          </Select>
          {Boolean(getErrorMessageByFieldName('funcao')) && (
            <FormErrorMessage>
              {getErrorMessageByFieldName('funcao')}
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

        {!colaborador && (
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
        )}

        {
          colaborador && (
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
        }

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
      <ChangePasswordModal
        open={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        colaboradorId={colaborador?.id}
        afterSubmit={() => setIsChangePasswordModalVisible(false)}
      />
    </>
  );
}
