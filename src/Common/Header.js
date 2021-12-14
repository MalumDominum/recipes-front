import React from "react";
import { Link } from "react-router-dom";
import "~/index.css";
import "./Header.css";

const Header = () => {
	return (
		<header id="header" className="container">
			<Link to="/" className="logo-container">
				<div className="img logo"></div>
				<div className="logo-text">
					Plat<span>e</span>
				</div>
			</Link>
			<nav>
				<Link to="/recipes">Рецепты</Link>
				<Link to="/ingredients">Ингредиенты</Link>
				<Link to="/recipes/new">Добавить рецепт</Link>
				<Link to="/authorization" className="login-button">
					Войти
				</Link>
			</nav>
		</header>
	);
};

export default Header;
