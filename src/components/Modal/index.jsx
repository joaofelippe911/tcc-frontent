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
  open,
  title,
  onCancel,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  isSubmiting = false,
  isLoading = false,
}) {
  return (
    <ChakraModal isOpen={open} onClose={onCancel} autoFocus={false} >
      <ModalOverlay backdropFilter='blur(3px)'/>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onCancel}
            disabled={isSubmiting || isLoading}
          >
            {cancelText}
          </Button>

          <Button
            colorScheme="red"
            onClick={onConfirm}
            isDisabled={isSubmiting || isLoading}
            isLoading={isSubmiting}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
