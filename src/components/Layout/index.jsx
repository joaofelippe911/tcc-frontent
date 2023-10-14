import { useLocation, useNavigate } from 'react-router-dom';

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FiHome, FiMenu, FiChevronDown, FiUsers } from 'react-icons/fi';
import logo from '../../assets/images/logo.png';
import AppRoutes from '../../routes/AppRoutes';
import { useAuthContext } from '../../contexts/AuthContext';

const LinkItems = [
  { name: 'Home', icon: FiHome, path: '/' },
  { name: 'Clientes', icon: FiUsers, path: '/clientes' },
  { name: 'Colaboradores', icon: FiUsers, path: '/colaboradores' },
  { name: 'Funções', icon: FiUsers, path: '/funcoes' },
  { name: 'Fornecedores', icon: FiUsers, path: '/fornecedores' },
  { name: 'Produtos', icon: FiUsers, path: '/produtos' },
];

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={'gray.900'}
      color="white"
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.800', 'gray.900')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
           <img src={logo} alt='logo' height={5}></img>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, path, children, ...rest }) => {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <Box
      as="a"
      onClick={() => navigate(path)}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'pink.400',
          color: 'white',
        }}
        bg={location.pathname.replace('/', '').split('/')[0] === (path.replace('/', '')) ? 'pink.400' : undefined}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const { user, signOut } = useAuthContext();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={'gray.900'}
      color="white"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.800', 'gray.900')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user.nome}</Text>
                  <Text fontSize="xs" color="whiteAlpha.700">
                    {user.funcao.nome}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={'gray.900'}
              borderColor={useColorModeValue('blackAlpha.200', 'gray.700')}
            >
              {/* <MenuDivider /> */}
              <MenuItem
                bg={'gray.900'}
                onClick={signOut}
              >
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const Layout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={'#1d202b'}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        style={{
          height: 1000,
        }}
      >
        <AppRoutes />
      </Box>
    </Box>
  );
};

export default Layout;
