import { Flex } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useAuthContext } from '../../contexts/AuthContext';

export default function TableRowActions({
  model,
  onClickView,
  onClickDelete,
}) {
  const { user } = useAuthContext();

  const canView = useMemo(() => {
    const hasPermission = user.funcao.permissoes.find(permission => permission.nome === `${model}-show`);

    return Boolean(hasPermission);
  }, [user, model]);

  const canDelete = useMemo(() => {
    const hasPermission = user.funcao.permissoes.find(permission => permission.nome === `${model}-destroy`);

    return Boolean(hasPermission);
  }, [user, model]);

  const handleClickView = useCallback(() => {
    if (!canView) {
      return;
    }

    onClickView();
  }, [canView, onClickView]);

  const handleClickDelete = useCallback(() => {
    if (!canDelete) {
      return;
    }

    onClickDelete();
  }, [canDelete, onClickDelete]);

  return (
    <Flex>
      <FiEdit
        fontSize={20}
        color="#ED64A6"
        cursor={canView ? 'pointer' : 'default'}
        onClick={handleClickView}
        style={{
          marginRight: 8,
          opacity: canView ? 1 : 0.5,
          cursor: !canView ? 'not-allowed' : undefined,
        }}
      />
      <FiTrash
        fontSize={20}
        color="#FC5050"
        cursor={canDelete ? 'pointer' : 'default'}
        onClick={handleClickDelete}
        style={{
          opacity: canDelete ? 1 : 0.5,
          cursor: !canDelete ? 'not-allowed' : undefined,
        }}
      />
    </Flex>
  );
}
