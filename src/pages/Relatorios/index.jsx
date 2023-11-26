import { Box, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Spinner from '../../components/Spinner';
import RelatorioVendas from './RelatorioVendas';
import RelatorioProdutos from './RelatorioProdutos';
import RelatorioClientes from './RelatorioClientes';
import TabList from './components/TabList';

export default function Relatorios() {
  return (
    <Box position="relative">
      <Spinner spinning={false} />
      <Box p={4}>
        <Tabs>
          <TabList
            tabs={[
              {
                name: 'Vendas',
                permission: 'relatorio-vendas',
              },
              {
                name: 'Produtos mais vendidos',
                permission: 'relatorio-produtos-mais-vendidos',
              },
              {
                name: 'Clientes que mais compraram',
                permission: 'relatorio-clientes-que-mais-compraram',
              }
            ]}
          />

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
