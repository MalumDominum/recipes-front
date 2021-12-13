import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header.js";
import Recipes from "./Recipes.js";
import "./index.css";

ReactDOM.render(
	<>
		<Header />
		<Recipes />
	</>,
	document.getElementById("root")
);
