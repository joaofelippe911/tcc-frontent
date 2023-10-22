import { Flex } from '@chakra-ui/react';
import { FiEdit, FiTrash } from 'react-icons/fi';

export default function TableRowActions({
  canView,
  canDelete,
  onClickView,
  onClickDelete,
}) {
  return (
    <Flex>
      <FiEdit
        fontSize={20}
        color="#ED64A6"
        cursor={canView ? 'pointer' : 'default'}
        onClick={onClickView}
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
        onClick={onClickDelete}
        style={{
          opacity: canDelete ? 1 : 0.5,
          cursor: !canDelete ? 'not-allowed' : undefined,
        }}
      />
    </Flex>
  );
}
