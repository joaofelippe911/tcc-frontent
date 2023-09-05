import { Box, Heading } from "@chakra-ui/react";
import { ClienteForm } from "../components/ClienteForm";

export default function NewCliente() {
    return (
        <Box>
            <Heading
                marginBottom={8}
            >
                Adicionar cliente
            </Heading>
            <ClienteForm />
        </Box>
    )
}