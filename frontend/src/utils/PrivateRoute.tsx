import { Navigate } from "react-router-dom"
import { homeRoute } from "./frontendRoutes"
import { User } from "firebase/auth";
import React from "react";

interface PrivateRouteProps{
    children: React.ReactNode;
    user: User | null
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, user }) => {
    if (!user){
        return <Navigate to={homeRoute}/>
    }

    return <>{children}</>
}

export default PrivateRoute
