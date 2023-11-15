import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/react';
import DatePicker from '../../../../components/DatePicker';
import { useCallback, useState } from 'react';

export default function RelatorioForm({ relatorio, title }) {
  const [inicio, setInicio] = useState(new Date());
  const [fim, setFim] = useState(new Date());

  const toast = useToast();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (inicio.getTime() > fim.getTime()) {
      toast({
        title: 'Data do fim do período precisa ser maior ou igual a data de início!',
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      });

      return;
    }

    const formattedInitialDate = inicio.toISOString().split('T')[0].split('-').reverse().join("-");
    const formattedEndDate = fim.toISOString().split('T')[0].split('-').reverse().join("-");

    window.open(`http://localhost:8000/api/${relatorio}?inicio=${formattedInitialDate}&fim=${formattedEndDate}`);

    console.log({inicio, fim, formattedInitialDate, formattedEndDate})
  }, [inicio, fim, toast, relatorio]);

  return (
    <Box>
      <Heading marginBottom={8}>
        {title}
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack direction={['column', 'row']} spacing={2} alignItems="flex-end">
          <Box>
            <HStack>
              <FormControl>
                <FormLabel>Data do início do período</FormLabel>
                <DatePicker onChange={setInicio} selectedDate={inicio} />
              </FormControl>
              <FormControl>
                <FormLabel>Data do fim do período</FormLabel>
                <DatePicker onChange={setFim} selectedDate={fim} />
              </FormControl>
            </HStack>
          </Box>
          <Button
            type='submit'
          >
            Gerar relatório
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
