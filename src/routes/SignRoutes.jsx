import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';

export default function SignRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
