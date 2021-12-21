import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useToken from "~/CustomHooks/useToken";

const PrivateRoute = () => {
	const [token] = useToken();

	// If authorized, return an outlet that will render child elements
	// If not, return element that will navigate to login page
	return token ? <Outlet /> : <Navigate to="/sign-up" replace />;
};

export default PrivateRoute;
