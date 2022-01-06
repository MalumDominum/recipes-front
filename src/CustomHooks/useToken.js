import { useState } from "react";

export default function useToken() {
	const getToken = () => {
		const tokenString = localStorage.getItem("token");
		const userToken = JSON.parse(tokenString);
		return userToken;
	};

	const [token, setToken] = useState(getToken());

	const saveToken = (userToken) => {
		if (userToken) {
			localStorage.setItem("token", JSON.stringify(userToken));
			setToken(userToken);
		} else {
			localStorage.setItem("token", null);
			setToken(null);
		}
	};

	return [token, saveToken];
}
