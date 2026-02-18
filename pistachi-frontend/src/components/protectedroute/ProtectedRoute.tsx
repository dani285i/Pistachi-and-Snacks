import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/Auth';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;