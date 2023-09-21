import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Colaborador from './pages/Colaborador';
import Funcao from './pages/Funcao';
import NewCliente from './pages/Clientes/NewCliente';
import EditCliente from './pages/Clientes/EditCliente';
import NewColaborador from './pages/Colaborador/NewColaborador';
import EditColaborador from './pages/Colaborador/EditColaborador';
import NewFuncao from './pages/Funcao/NewFuncao';
import EditFuncao from './pages/Funcao/EditFuncao';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/clientes" element={<Clientes />} />
      <Route path="/clientes/adicionar" element={<NewCliente />} />
      <Route path="/clientes/editar/:id" element={<EditCliente />} />

      <Route path="/colaborador" element={<Colaborador />} />
      <Route path="/colaborador/adicionar" element={<NewColaborador />} />
      <Route path="/colaborasdor/editar/:id" element={<EditColaborador />}/> 

      <Route path="/funcao" element={<Funcao />} />
      <Route path="/funcao/adicionar" element={<NewFuncao/>} />
      <Route path="/funcao/editar/:id" element={<EditFuncao />}/> 

    </Routes>

  );

  
}
