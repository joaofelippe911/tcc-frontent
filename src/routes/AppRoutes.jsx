import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Clientes from '../pages/Clientes';
import Colaboradores from '../pages/Colaboradores';
import Funcoes from '../pages/Funcoes';
import NewCliente from '../pages/Clientes/NewCliente';
import EditCliente from '../pages/Clientes/EditCliente';
import NewColaborador from '../pages/Colaboradores/NewColaborador';
import EditColaborador from '../pages/Colaboradores/EditColaborador';
import NewFuncao from '../pages/Funcoes/NewFuncao';
import EditFuncao from '../pages/Funcoes/EditFuncao';
import Fornecedores from '../pages/Fornecedores';
import EditFornecedor from '../pages/Fornecedores/EditFornecedor';
import NewFornecedor from '../pages/Fornecedores/NewFornecedor';
import Produtos from '../pages/Produtos';
import EditProdutos from '../pages/Produtos/EditProduto';
import NewProduto from '../pages/Produtos/NewProduto';
import Unauthorized from '../pages/Unauthorized';
import RequireAuthorization from './RequireAuthorization';
import Vendas from '../pages/Vendas';
import NewVenda from '../pages/Vendas/NewVenda';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Clientes */}
      <Route element={<RequireAuthorization allowedPermissions={['cliente-index']} />}>
        <Route path="/clientes" element={<Clientes />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['cliente-store']} />}>
        <Route path="/clientes/adicionar" element={<NewCliente />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['cliente-show']} />}>
        <Route path="/clientes/editar/:id" element={<EditCliente />} />
      </Route>

      {/* Colaboradores */}
      <Route element={<RequireAuthorization allowedPermissions={['colaborador-index']} />}>
        <Route path="/colaboradores" element={<Colaboradores />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['colaborador-store']} />}>
        <Route path="/colaboradores/adicionar" element={<NewColaborador />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['colaborador-show']} />}>
        <Route path="/colaboradores/editar/:id" element={<EditColaborador />} />
      </Route>

      {/* Funcoes */}
      <Route element={<RequireAuthorization allowedPermissions={['funcao-index']} />}>
        <Route path="/funcoes" element={<Funcoes />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['funcao-store']} />}>
        <Route path="/funcoes/adicionar" element={<NewFuncao />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['funcao-show']} />}>
        <Route path="/funcoes/editar/:id" element={<EditFuncao />} />
      </Route>

      {/* Fornecedores */}
      <Route element={<RequireAuthorization allowedPermissions={['fornecedor-index']} />}>
        <Route path="/fornecedores" element={<Fornecedores />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['fornecedor-store']} />}>
        <Route path="/fornecedores/adicionar" element={<NewFornecedor />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['fornecedor-show']} />}>
        <Route path="/fornecedores/editar/:id" element={<EditFornecedor />} />
      </Route>

      {/* Produtos */}
      <Route element={<RequireAuthorization allowedPermissions={['produto-index']} />}>
        <Route path="/produtos" element={<Produtos />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['produto-store']} />}>
        <Route path="/produtos/adicionar" element={<NewProduto />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['produto-show']} />}>
        <Route path="/produtos/editar/:id" element={<EditProdutos />} />
      </Route>

      {/* Vendas */}
      <Route element={<RequireAuthorization allowedPermissions={['venda-index']} />}>
        <Route path="/vendas" element={<Vendas />} />
      </Route>
      <Route element={<RequireAuthorization allowedPermissions={['venda-store']} />}>
        <Route path="/vendas/adicionar" element={<NewVenda />} />
      </Route>
      {/* <Route element={<RequireAuthorization allowedPermissions={['produto-show']} />}>
        <Route path="/produtos/editar/:id" element={<EditProdutos />} />
      </Route> */}

      <Route path="/inautorizado" element={<Unauthorized />} />
    </Routes>
  );
}
