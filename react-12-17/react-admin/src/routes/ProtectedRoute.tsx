import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { verifyJWT } from '../utils';

interface ProtectedRouteProps extends RouteProps {
        component: ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
            const token = localStorage.getItem('jwt_token');
            const isTokenValid = token && verifyJWT(token);
            if (!isTokenValid) {
                    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
            }
            return <Component {...props} />;
    }} />
);

export default ProtectedRoute;
