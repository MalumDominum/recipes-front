import React from "react";
import "./Header.css";
import "./index.css";

const Header = () => {
	return (
		<header id="header" className="container">
			<a className="logo-container">
				<div className="img logo"></div>
				<div className="logo-text">
					Plat<span>e</span>
				</div>
			</a>
			<nav>
				<a href="">Рецепты</a>
				<a href="">Ингредиенты</a>
				<a href="">Категории</a>
				<a href="">Кухни</a>
				<a className="login-button" href="">
					Войти
				</a>
			</nav>
		</header>
	);
};

export default Header;
