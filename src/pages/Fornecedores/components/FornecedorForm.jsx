import { Form } from "react-router-dom";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import useErrors from "../../../hooks/useErrors";
import { onlyNumbers } from "../../../utils/onlyNumbers";
import { formatCnpj } from "../../../utils/formatCnpj";

export function FornecedorForm({ onSubmit, fornecedor = undefined }) {
  const [nome, setNome] = useState(fornecedor?.nome || "");
  const [cnpj, setCnpj] = useState(fornecedor?.cnpj || "");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { setError, removeError, errors, getErrorMessageByFieldName } =
    useErrors();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        nome,
        cnpj: onlyNumbers(cnpj),
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome, cnpj]
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

  const handleCnpjChange = useCallback(
    (e) => {
      setCnpj(formatCnpj(e.target.value));

      if (!e.target.value) {
        setError({ field: "cnpj", message: "CNPJ é obrigatório!" });
        return;
      }

      if (onlyNumbers(e.target.value).length < 14) {
        setError({ field: "cnpj", message: "CNPJ inválido!" });
        return;
      }

      removeError("cnpj");
    },
    [setError, removeError]
  );

  const isFormValid = nome && cnpj && errors.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={Boolean(getErrorMessageByFieldName("nome"))}>
        <FormLabel>Nome</FormLabel>
        <Input
          type="text"
          name="nome"
          value={nome}
          onChange={handleNomeChange}
          placeholder="Digite o nome do fornecedor"
        />
        {Boolean(getErrorMessageByFieldName("nome")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("nome")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("cnpj"))}
      >
        <FormLabel>CNPJ</FormLabel>
        <Input
          type="text"
          name="cnpj"
          value={cnpj}
          onChange={handleCnpjChange}
          placeholder="Digite o CNPJ do fornecedor"
          maxLength={18}
        />
        {Boolean(getErrorMessageByFieldName("cnpj")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("cnpj")}
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
