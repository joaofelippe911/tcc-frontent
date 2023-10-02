import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Clientes from '../pages/Clientes';
import Colaborador from '../pages/Colaborador';
import Funcao from '../pages/Funcao';
import NewCliente from '../pages/Clientes/NewCliente';
import EditCliente from '../pages/Clientes/EditCliente';
import NewColaborador from '../pages/Colaborador/NewColaborador';
import EditColaborador from '../pages/Colaborador/EditColaborador';
import NewFuncao from '../pages/Funcao/NewFuncao';
import EditFuncao from '../pages/Funcao/EditFuncao';
import Fornecedores from '../pages/Fornecedores';
import EditFornecedor from '../pages/Fornecedores/EditFornecedor';
import NewFornecedor from '../pages/Fornecedores/NewFornecedor';
import Produtos from '../pages/Produtos';
import EditProdutos from '../pages/Produtos/EditProduto';
import NewProdutos from '../pages/Produtos/NewProduto';
import NewProduto from '../pages/Produtos/NewProduto';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/clientes" element={<Clientes />} />
      <Route path="/clientes/adicionar" element={<NewCliente />} />
      <Route path="/clientes/editar/:id" element={<EditCliente />} />

      <Route path="/colaborador" element={<Colaborador />} />
      <Route path="/colaborador/adicionar" element={<NewColaborador />} />
      <Route path="/colaborador/editar/:id" element={<EditColaborador />} />

      <Route path="/funcao" element={<Funcao />} />
      <Route path="/funcao/adicionar" element={<NewFuncao />} />
      <Route path="/funcao/editar/:id" element={<EditFuncao />} />

      <Route path="/fornecedores" element={<Fornecedores />} />
      <Route path="/fornecedores/adicionar" element={<NewFornecedor />} />
      <Route path="/fornecedores/editar/:id" element={<EditFornecedor />} />

      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produtos/adicionar" element={<NewProduto />} />
      <Route path="/produtos/editar/:id" element={<EditProdutos />} />
    </Routes>
  );
}
