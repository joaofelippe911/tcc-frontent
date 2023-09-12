import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import useErrors from "../../../hooks/useErrors";
import { formatCpf } from "../../../utils/formatCpf";
import { onlyNumbers } from "../../../utils/onlyNumbers";
import formatPhone from "../../../utils/formatPhone";

export function ColaboradorForm({ onSubmit, colaborador = undefined }) {
  const [nome, setNome] = useState(colaborador?.nome || "");
  const [cpf, setCpf] = useState(
    colaborador?.cpf ? formatCpf(colaborador.cpf) : ""
  );
  const [telefone, setTelefone] = useState(
    colaborador?.telefone ? formatPhone(colaborador.telefone) : ""
  );
  const [funcao_id, setFuncao] = useState(colaborador?.funcao || "");
  const [isSubmiting, setIsSubmiting] = useState(false);

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
        cpf: onlyNumbers(cpf),
        telefone: onlyNumbers(telefone),
        funcao_id: funcao,
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome, cpf, telefone, funcao_id]
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

  const handleCpfChange = useCallback(
    (e) => {
      setCpf(formatCpf(e.target.value));

      if (!e.target.value) {
        setError({ field: "cpf", message: "CPF é obrigatório!" });
        return;
      }

      if (onlyNumbers(e.target.value).length < 11) {
        setError({ field: "cpf", message: "CPF inválido!" });
        return;
      }

      removeError("cpf");
    },
    [setError, removeError]
  );

  const handleTelefoneChange = useCallback(
    (e) => {
      setTelefone(formatPhone(e.target.value));

      if (!e.target.value) {
        setError({ field: "telefone", message: "Telefone é obrigatório!" });
        return;
      }

      if (onlyNumbers(e.target.value).length < 11) {
        setError({ field: "telefone", message: "Telefone inválido!" });
        return;
      }

      removeError("telefone");
    },
    [setError, removeError]
  );

  const isFormValid = nome && cpf && telefone && errors.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={Boolean(getErrorMessageByFieldName("nome"))}>
        <FormLabel>Nome completo</FormLabel>
        <Input
          type="text"
          name="nome"
          value={nome}
          onChange={handleNomeChange}
          placeholder="Digite o nome completo do colaborador"
        />
        {Boolean(getErrorMessageByFieldName("nome")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("nome")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("cpf"))}
      >
        <FormLabel>CPF</FormLabel>
        <Input
          type="text"
          name="cpf"
          value={cpf}
          onChange={handleCpfChange}
          placeholder="Digite o CPF do colaborador"
        />
        {Boolean(getErrorMessageByFieldName("cpf")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("cpf")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("telefone"))}
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
        {Boolean(getErrorMessageByFieldName("telefone")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("telefone")}
          </FormErrorMessage>
        )}
      </FormControl>

      <form onSubmit={handleSubmit}>
        <FormLabel>Função</FormLabel>
        <Input
          type="text"
          name="nome"
          value={nome}
          onChange={(e) => setFuncaoId(e.target.value)}
        />
        <option value="0">Selecione uma função</option>
        {cursos.map((funcao) => (
          <option key={funcao.id} value={funcao.id}>
            {funcao.nome}
          </option>
        ))}

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
    </form>
  );
}
