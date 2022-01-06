import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UrlContext } from "~/App";
import sendRequest from "~/Common/sendRequest";
import Header from "~/Common/Header";
import Heading from "~/Common/Title";
import { IngredientsFilter } from "~/Common/Filter";
import "~/index.css";
import "./Ingredients.css";

const IngredientCard = (props) => {
	let backgroundImage = { backgroundImage: "url(data:image/jpg;base64," + props.image + ")" };

	return (
		<div className="card-container ingredient img" style={backgroundImage}>
			<Link to={"/ingredients/" + props.ingredientId} className="card-heading">
				{props.heading}
			</Link>
			{/* TODO Request in ingredientCard to IngredientRecipe <Link to={"/recipes?ingredientId=" + props.ingredientId} className="recipes-count">
 				{props.recipesCount} Рецептов с этим ингредиентом
 			</Link>*/}
		</div>
	);
};

const IngredientsCatalogPage = () => {
	const [ingredients, setIngredients] = useState();
	const apiRequestUrl = useContext(UrlContext) + "ingredients";

	useEffect(() => sendRequest(null, apiRequestUrl, "GET").then(setIngredients).catch(console.error), []);

	return (
		<>
			<Header />
			<Heading>Ингредиенты</Heading>
			<div className="page-content">
				<IngredientsFilter setFiltered={setIngredients} />
				<div className="cards-container">
					{ingredients?.map((i) => (
						<IngredientCard key={i.id} ingredientId={i.id} heading={i.name} image={i.image} />
					))}
				</div>
			</div>
		</>
	);
};

export default IngredientsCatalogPage;
