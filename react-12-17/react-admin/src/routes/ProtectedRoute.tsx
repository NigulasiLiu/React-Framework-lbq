import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { verifyJWT } from '../utils';

// @ts-ignore
const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const token = localStorage.getItem('jwt_token');  // 从localStorage获取token
        const isTokenValid = token && verifyJWT(token); // 假设verifyJWT是你的验证函数
        console.log("isTokenValid", isTokenValid);
        return isTokenValid ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        );
    }} />
);

export default ProtectedRoute;