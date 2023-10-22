import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext'

export default function RequireAuthorization({ allowedPermissions }) {
  const { user } = useAuthContext();
  const location = useLocation();

  return (
    user.funcao.permissoes.find(permission => allowedPermissions?.includes(permission.nome))
      ? <Outlet />
      : <Navigate to="/inautorizado" state={{ from: location }} replace />
  )
}