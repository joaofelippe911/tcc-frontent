import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { httpClient } from '../services/HttpClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [signed, setSigned] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const toast = useToast();
  
  const signIn = useCallback(async ({email, password}) => {
    try {
      const { data } = await httpClient.post('http://localhost:8000/api/login', { email, password });

      httpClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      setUser(data.user);
      setSigned(true);
      toast.closeAll();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      if (err instanceof AxiosError && err.message === "Network Error") {
        toast({
          title: 'Erro ao se conectar com o servidor.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        return;
      }

      toast({
        title: 'Credenciais inválidas!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      await httpClient.post('http://localhost:8000/api/logout');
    } catch (err) {}

    httpClient.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("token");
    setSigned(false);
    setUser(undefined);
    toast.closeAll();
    navigate('/')
  }, [navigate, toast]);

  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      httpClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      setSigned(true);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user, signed, signIn, signOut }} >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext);
}