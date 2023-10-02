import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import logo from '../../assets/images/logo.png';
import { useAuthContext } from '../../contexts/AuthContext';
import useErrors from '../../hooks/useErrors';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuthContext();

  const { getErrorMessageByFieldName } = useErrors();

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleClickSignIn = useCallback(() => {
    signIn({ email, password });
  }, [email, password, signIn]);

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
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
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'lg', sm: 'lg' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
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
              <FormControl>
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
              <Button onClick={handleClickSignIn}>Entrar</Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
