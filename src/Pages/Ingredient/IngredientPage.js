import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import sendRequest from "~/Common/sendRequest";
import ParagraphWithNewLines from "~/Common/ParagraphWithNewLines";
import { UrlContext } from "~/App";
import Header from "~/Common/Header";
import Heading from "~/Common/Title";
import "~/index.css";
import "./Ingredient.css";

const Ingredient = (props) => {
	const [group, setGroup] = useState();
	const [recipes, setRecipes] = useState();
	const rootApiUrl = useContext(UrlContext);

	useEffect(() => {
		sendRequest(null, rootApiUrl + "ingredientGroups/" + props.groupId, "GET")
			.then(setGroup)
			.catch(console.error);

		sendRequest(null, rootApiUrl + "/ingredientRecipe/ingredients/" + props.id, "GET")
			.then(setRecipes)
			.catch(console.error);
	}, []);

	const backgroundImage = { backgroundImage: "url(data:image/jpg;base64," + props.image + ")" };
	return (
		<div className="ingredient-container">
			<div className="img" style={backgroundImage}></div>
			<Link to={"/ingredients?ingredientsGroupId=" + props.groupId} className="link">
				{group?.name}
			</Link>
			<Link to={"/recipes?ingredientId=" + props.id} className="link">
				{recipes?.lenght} Рецептов с этим ингредиентом
			</Link>
			{props.description ? <ParagraphWithNewLines className="description" text={props.description} /> : null}
		</div>
	);
};

const IngredientPage = () => {
	let { ingredientId } = useParams();
	const [ingredient, setIngredient] = useState();
	const rootApiUrl = useContext(UrlContext);

	useEffect(
		() =>
			sendRequest(null, rootApiUrl + "ingredients/" + ingredientId, "GET")
				.then(setIngredient)
				.catch(console.error),
		[]
	);

	return (
		<>
			<Header />
			<Heading>{ingredient?.name}</Heading>
			{ingredient ? <Ingredient id={ingredient.id} groupId={ingredient.groupId} image={ingredient.image} description={ingredient.description} /> : null}
		</>
	);
};

export default IngredientPage;
