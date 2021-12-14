import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "~/Common/Header";
import Heading from "~/Common/Title";
import "~/index.css";
import "./Ingredient.css";

const IngredientPage = () => {
	let { ingredientId } = useParams();

	return (
		<>
			<Header />
			<Heading>{"Ингредиент " + ingredientId}</Heading>
		</>
	);
};

export default IngredientPage;
