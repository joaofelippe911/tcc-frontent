import {
  AspectRatio,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import useErrors from "../../../hooks/useErrors";
import { onlyNumbers } from "../../../utils/onlyNumbers";
import { httpClient } from "../../../services/HttpClient";
import { AxiosError } from "axios";
import  {formatValor} from "../../../utils/formatValor";
import { motion, useAnimation } from "framer-motion";
import { PreviewImage } from "./PreviewImage";

import flowerImage from '../../../assets/images/flower.png';

const flowerImageAnimation = {
  rest: {
    scale: 1.1,
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.3,
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

const imageAnimation = {
  rest: {
    scale: 1,
    filter: "grayscale(0%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.1,
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
}

export function ProdutoForm({ onSubmit, produto = undefined }) {
  const [nome, setNome] = useState(produto?.nome || "");
  const [valor, setValor] = useState(produto?.valor ? formatValor(produto.valor) : "");
  const [estoque, setEstoque] = useState(produto?.estoque ? produto.estoque : "");
  const [imagem, setImagem] = useState(produto?.imagem || "");
  const [preview, setPreview] = useState(undefined);
  const [fornecedor_id, setFornecedor] = useState(produto?.fornecedor_id || "");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);

  const toast = useToast();
  
  const controls = useAnimation();
  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();

  const {
    setError,
    removeError,
    errors,
    getErrorMessageByFieldName,
  } = useErrors();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsSubmiting(true);

      await onSubmit({
        nome,
        valor: onlyNumbers(valor),
        estoque,
        imagem,
        fornecedor_id,
      });

      setIsSubmiting(false);
    },
    [onSubmit, nome, valor, estoque, imagem, fornecedor_id]
  );

  const handleNomeChange = useCallback(
    (e) => {
      setNome(e.target.value);

      if (!e.target.value) {
        setError({ field: "nome", message: "Nome é obrigatório!" });
        return;
      }

      removeError("nome");
    },
    [setError, removeError]
  );

  const handleValorChange = useCallback(
    (e) => {
      setValor(formatValor(e.target.value));

      if (!e.target.value) {
        setError({ field: "valor", message: "Valor é obrigatório!" });
        return;
      }

      removeError("valor");
    },
    [setError, removeError]
  );

  const handleEstoqueChange = useCallback(
    (e) => {
      setEstoque((e.target.value));

      if (!e.target.value) {
        setError({ field: "estoque", message: "Estoque é obrigatório!" });
        return;
      }

      removeError("estoque");
    },
    [setError, removeError]

  );

  const handleFornecedorChange = useCallback(
    (e) => {
      setFornecedor(e.target.value);

      if (!e.target.value) {
        setError({ field: "fornecedor", message: "Fornecedor é obrigatório!" });
        return;
      }

      removeError("fornecedor");
    },
    [setError, removeError]
  );

  const handleImagemChange = useCallback(
    (e) => {
      setImagem(e.target.files[0]);
    },
    []
  );
 
  useEffect(() => {
    async function loadFornecedores() {
      try {
        const { data } = await httpClient.get('/fornecedores');

        setFornecedores(data);
      } catch (err) {
        if (err instanceof AxiosError && err.name === 'CanceledError') {
          return;
        }

        toast({
          title: err.response.data.message || 'Erro ao carregar fornecedores!',
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    loadFornecedores();
  }, [toast]);

  const isFormValid = nome && valor && estoque && imagem && fornecedor_id  && errors.length === 0;

  useEffect(() => {
    if (!imagem) {
      setPreview(undefined);
      return;
    }

    const url = URL.createObjectURL(imagem);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    }
  }, [imagem]);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={Boolean(getErrorMessageByFieldName("nome"))}>
        <FormLabel>Nome</FormLabel>
        <Input
          type="text"
          name="nome"
          value={nome}
          onChange={handleNomeChange}
          placeholder="Digite o nome do produto"
        />
        {Boolean(getErrorMessageByFieldName("nome")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("nome")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("valor"))}
      >
        <FormLabel>Valor</FormLabel>
        <Input
          type="text"
          name="valor"
          value={valor}
          onChange={handleValorChange}
          placeholder="Digite o valor do produto"
        />
        {Boolean(getErrorMessageByFieldName("valor")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("valor")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("estoque"))}
      >
        <FormLabel>Estoque</FormLabel>
        <Input
          type="text"
          name="estoque"
          value={estoque}
          onChange={handleEstoqueChange}
          placeholder="Digite a quantidade em estoque do produto"
          maxLength={15}
        />
        {Boolean(getErrorMessageByFieldName("estoque")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("estoque")}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl
        marginTop={4}
        isInvalid={Boolean(getErrorMessageByFieldName("fornecedor"))}
      >
        <FormLabel>Fornecedor</FormLabel>
        <Select
          placeholder="Selecione o fornecedor"
          onChange={handleFornecedorChange}
          value={fornecedor_id}
        >
          {
            fornecedores.map((fornecedor) => (
              <option value={fornecedor.id} key={fornecedor.id}>{fornecedor.nome}</option>
            ))
          }
        </Select>
        {Boolean(getErrorMessageByFieldName("fornecedor")) && (
          <FormErrorMessage>
            {getErrorMessageByFieldName("fornecedor")}
          </FormErrorMessage>
        )}
      </FormControl>

      <Container my="12">
      <AspectRatio width="64" ratio={1}>
        <Box
          borderColor="gray.300"
          borderStyle="dashed"
          borderWidth="2px"
          rounded="md"
          shadow="sm"
          role="group"
          transition="all 150ms ease-in-out"
          _hover={{
            shadow: "md"
          }}
          as={motion.div}
          initial="rest"
          animate="rest"
          whileHover="hover"
        >
          <Box position="relative" height="100%" width="100%">
            <Box
              position="absolute"
              top="0"
              left="0"
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
            >
              <Stack
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justify="center"
                spacing="4"
              >
                <Box height={!preview ? "16" : '100%'} width={!preview ? "12" : '100%'} position="relative">
                  <PreviewImage
                    variants={!preview ? flowerImageAnimation : imageAnimation}
                    backgroundImage={preview || flowerImage}  
                  />
                </Box>
                {
                  !preview && (
                    <Stack p="8" textAlign="center" spacing="1">
                      <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                        Arraste uma imagem aqui
                      </Heading>
                      <Text fontWeight="light">ou clique para selecionar</Text>
                    </Stack>
                  )
                }
                
              </Stack>
            </Box>
            <Input
              type="file"
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              opacity="0"
              aria-hidden="true"
              accept="image/*"
              multiple={false}
              onDragEnter={startAnimation}
              onDragLeave={stopAnimation}
              onChange={handleImagemChange}
            />
          </Box>
        </Box>
      </AspectRatio>
    </Container>

        <Button
          width="full"
          mt={4}
          type="submit"
          isDisabled={isSubmiting || !isFormValid}
          isLoading={isSubmiting}
        >
          Salvar
        </Button>
    </form>
  );
}
