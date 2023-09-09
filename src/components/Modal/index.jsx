import {
  Button,
  Modal as ChakraModal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

export default function Modal({
  open, title, onCancel, onConfirm, cancelText = "Cancelar", confirmText = "Confirmar"
}) {
  return (
    <ChakraModal isOpen={open} onClose={onCancel} autoFocus={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            colorScheme="red"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
