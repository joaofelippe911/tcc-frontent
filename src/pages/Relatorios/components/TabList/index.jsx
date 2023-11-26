import { Tab, TabList as ChakraTabList } from '@chakra-ui/react';
import { useAuthContext } from '../../../../contexts/AuthContext';
import { useMemo } from 'react';

export default function TabList({ tabs }) {
  const { user } = useAuthContext();

  const userPermissions = useMemo(() => {
    return user.funcao.permissoes;
  }, [user]);

  const filteredTabs = useMemo(() => {
    return tabs.filter((tab) => userPermissions.some((p) => p.nome === tab.permission))
  }, [tabs, userPermissions]);

  return (
    <ChakraTabList>
      {
        filteredTabs.map((tab) => {
          return (
            <Tab key={tab.permission} >{tab.name}</Tab>
          )
        })
      }
    </ChakraTabList>
  );
}
