import { Box, Button, Heading, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../services/HttpClient';
import formatPhone from '../../utils/formatPhone';
import { formatCpf } from '../../utils/formatCpf';

export default function Clientes() {
    const [clientes, setClientes] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadClientes() {
            const { data } = await httpClient.get('/clientes');

            setClientes(data);
        }

        loadClientes();
    }, []);

    console.log({clientes});

    return (
        <Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Heading>
                    Clientes
                </Heading>
                <Button
                    onClick={() => navigate("/clientes/adicionar")}
                >
                    Adicionar cliente
                </Button>
            </Box>
            <TableContainer
                marginTop={16}
            >
                <Table variant='simple'>
                    <TableCaption>Clientes cadastrados</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>Email</Th>
                            <Th>CPF</Th>
                            <Th>Telefone</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            clientes.map((cliente) => (
                                <Tr>
                                    <Td>{cliente.nome}</Td>
                                    <Td>{cliente.email}</Td>
                                    <Td>{formatCpf(cliente.cpf)}</Td>
                                    <Td>{formatPhone(cliente.telefone)}</Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
        
    )
}