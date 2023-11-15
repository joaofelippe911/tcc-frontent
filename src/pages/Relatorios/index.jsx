import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Spinner from '../../components/Spinner';
import RelatorioVendas from './RelatorioVendas';
import RelatorioProdutos from './RelatorioProdutos';
import RelatorioClientes from './RelatorioClientes';

export default function Relatorios() {
  return (
    <Box position="relative">
      <Spinner spinning={false} />
      <Box p={4}>
        <Tabs>
          <TabList>
            <Tab>Vendas</Tab>
            <Tab>Produtos mais vendidos</Tab>
            <Tab>Clientes que mais compraram</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <RelatorioVendas />
            </TabPanel>
            <TabPanel>
              <RelatorioProdutos />
            </TabPanel>
            <TabPanel>
              <RelatorioClientes />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
