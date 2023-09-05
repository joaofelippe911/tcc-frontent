import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import NewCliente from "./pages/Clientes/NewCliente";

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/adicionar" element={<NewCliente />} />
        </Routes>
    )
}