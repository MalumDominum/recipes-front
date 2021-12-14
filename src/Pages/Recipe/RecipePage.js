import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "~/Common/Header.js";
import Heading from "~/Common/Title.js";
import "~/index.css";
import "./Recipe.css";

const RecipePage = () => {
	let { recipeId } = useParams();

	return (
		<>
			<Header />
			<Heading>{"Рецепт " + recipeId}</Heading>
		</>
	);
};

export default RecipePage;
