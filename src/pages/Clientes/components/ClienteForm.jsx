import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";


export function ClienteForm() {
    return (
        <form>
            <FormControl>
              <FormLabel>Nome completo</FormLabel>
              <Input type="text" placeholder="Digite o nome completo do cliente" />
            </FormControl>

            <FormControl
                marginTop={4}
            >
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="exemplo@exemplo.com" />
            </FormControl>

            <FormControl
                marginTop={4}
            >
              <FormLabel>Endereço</FormLabel>
              <Input type="text" placeholder="Digite o endereço completo do cliente" />
            </FormControl>

            <FormControl
                marginTop={4}
            >
              <FormLabel>CPF</FormLabel>
              <Input type="text" placeholder="Digite o CPF do cliente" />
            </FormControl>

            <FormControl
                marginTop={4}
            >
              <FormLabel>Telefone</FormLabel>
              <Input type="text" placeholder="Digite o telefone do cliente" />
            </FormControl>
            
            <Button width="full" mt={4} type="submit">
              Salvar
            </Button>
          </form>
    )
}

{/* <FormControl mt={6}>
    <FormLabel>Senha</FormLabel>
    <Input type="password" placeholder="********" />
</FormControl> */}