import React from "react";
import { Link } from "react-router-dom";
import useToken from "~/CustomHooks/useToken";
import "~/index.css";
import "./Header.css";

const NavigationBar = () => {
	const [token, setToken] = useToken();

	if (!token)
		return (
			<nav className="header-nav container">
				<Link to="/recipes">Рецепты</Link>
				<Link to="/ingredients">Ингредиенты</Link>
				<Link to="/recipes/new">Добавить рецепт</Link>
				<Link to="/sign-in" className="sign-in-button">
					Войти
				</Link>
			</nav>
		);
	else
		return (
			<nav className="header-nav container">
				<Link to="/recipes">Рецепты</Link>
				<Link to="/ingredients">Ингредиенты</Link>
				<Link to="/recipes/new">Добавить рецепт</Link>
				<div>
					<div className="user-info">
						{token.firstName} {token.lastName}
					</div>
					<button className="sign-out-button" onClick={() => setToken(null)}>
						Выйти
					</button>
				</div>
			</nav>
		);
};

const Header = () => {
	return (
		<header id="header" className="header-container">
			<Link to="/" className="logo-container">
				<div className="img logo"></div>
				<div className="logo-text">
					Plat<span>e</span>
				</div>
			</Link>
			<NavigationBar />
		</header>
	);
};

export default Header;
