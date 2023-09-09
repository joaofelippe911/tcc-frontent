import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import NewCliente from './pages/Clientes/NewCliente';
import EditCliente from './pages/Clientes/EditCliente';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/clientes" element={<Clientes />} />
      <Route path="/clientes/adicionar" element={<NewCliente />} />
      <Route path="/clientes/editar/:id" element={<EditCliente />} />
      
    </Routes>
  );
}
