import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import logo from '../../assets/images/logo.png';
import { useAuthContext } from '../../contexts/AuthContext';
import useErrors from '../../hooks/useErrors';
import isEmailValid from '../../utils/isEmailValid';

export default function Login() {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuthContext();

  const { setError, getErrorMessageByFieldName, removeError } = useErrors();

  const handleEmailChange = useCallback(
    (e) => {
      setEmail(e.target.value);
      removeError('email');
    },
    [removeError]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value);
      removeError('password');
    },
    [removeError]
  );

  const handleSignIn = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmiting(true);

      let hasValidationErrors = false;

      if (!email) {
        hasValidationErrors = true;
        setError({ field: 'email', message: 'Preencha o email' });
      }

      if (!isEmailValid(email)) {
        hasValidationErrors = true;
        setError({ field: 'email', message: 'Email inválido' });
      }

      if (!password) {
        hasValidationErrors = true;
        setError({ field: 'password', message: 'Preencha a senha' });
      }

      if (hasValidationErrors) {
        setIsSubmiting(false);
        return;
      }

      await signIn({ email, password });

      setIsSubmiting(false);
    },
    [email, password, signIn, setError]
  );

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <form onSubmit={handleSignIn} noValidate>
        <Stack spacing="8">
          <Stack spacing="6">
            <Box display="flex" alignItems="center" justifyContent="center">
              <img
                src={logo}
                alt="logo"
                style={{
                  width: 250,
                }}
              />
            </Box>
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'xs', md: 'sm' }}>
                Faça o login em sua conta
              </Heading>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg="blackAlpha.100"
            boxShadow="base"
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl
                  isInvalid={Boolean(getErrorMessageByFieldName('email'))}
                >
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    type="email"
                    id="email"
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
                  isInvalid={Boolean(getErrorMessageByFieldName('password'))}
                >
                  <FormLabel htmlFor="password">Senha</FormLabel>
                  <Input
                    type="password"
                    id="passsword"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="********"
                  />
                  {Boolean(getErrorMessageByFieldName('password')) && (
                    <FormErrorMessage>
                      {getErrorMessageByFieldName('password')}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
              <Stack spacing="6">
                <Button type="submit" isLoading={isSubmiting}>Entrar</Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Container>
  );
}
