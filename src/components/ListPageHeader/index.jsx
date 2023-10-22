import { Box, Button, Heading } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

export default function ListPageHeader({
  model,
  title,
  ButtonLabel,
  onClickButton,
}) {
  const { user } = useAuthContext();

  const canAdd = useMemo(() => {
    const hasPermission = user.funcao.permissoes.find(permission => permission.nome === `${model}-store`);

    return Boolean(hasPermission);
  }, [user, model]);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Heading>{title}</Heading>
      <Button
        isDisabled={!canAdd}
        onClick={onClickButton}
      >
        {ButtonLabel}
      </Button>
    </Box>
  )
}