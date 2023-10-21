import {
  Button,
  Modal as ChakraModal,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import useErrors from '../../../hooks/useErrors';
import { httpClient } from '../../../services/HttpClient';
import isPasswordValid from '../../../utils/isPasswordValid';

export default function ChangePasswordModal({
  open = true,
  onCancel,
  colaboradorId,
  afterSubmit,
}) {
  const [password, setPassowrd] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const toast = useToast();
  const { errors, setError, removeError, getErrorMessageByFieldName } = useErrors();

  const handlePasswordChange = useCallback(
    (e) => {
      setPassowrd(e.target.value);

      if (!e.target.value) {
        setError({ field: 'password', message: 'Senha é obrigatório!' });
        return;
      }

      if (!isPasswordValid(e.target.value)) {
        setError({ field: 'password', message: 'A senha precisa ter entre 8 e 20 caracteres, conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial!' });
        return;
      }

      removeError('password');
    },
    [setError, removeError]
  );

  const handleClickChangePassword = useCallback(async () => {
    try {
      setIsSubmiting(true);

      await httpClient.patch(`/colaboradores/${colaboradorId}`, { password });
      toast({
        title: 'Senha alterada com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      setIsSubmiting(false);
      setPassowrd('');
      afterSubmit();
    } catch (err) {
      setIsSubmiting(false);
      toast({
        title: err.response.data.message || 'Erro ao alterar senha!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [colaboradorId, password, toast, afterSubmit]);

  const isFormValid = password && errors.length === 0;

  return (
    <ChakraModal isOpen={open} onClose={onCancel} autoFocus={false}>
      <ModalOverlay backdropFilter='blur(3px)' />
      <ModalContent>
        <ModalHeader>Alterar senha</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl
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
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onCancel}
            isDisabled={isSubmiting}
          >
            Cancelar
          </Button>

          <Button
            colorScheme="red"
            onClick={handleClickChangePassword}
            isDisabled={isSubmiting || !isFormValid}
            isLoading={isSubmiting}
          >
            Alterar
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
