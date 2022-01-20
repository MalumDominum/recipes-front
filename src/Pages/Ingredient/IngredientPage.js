import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import sendRequest from "~/Common/sendRequest";
import ParagraphWithNewLines from "~/Common/ParagraphWithNewLines";
import { UrlContext } from "~/App";
import Header from "~/Common/Header";
import Heading from "~/Common/Title";
import { RecipesCatalog } from "../RecipesCatalog/RecipesCatalogPage";
import "~/index.css";
import "~/Common/Individual.css";

const Ingredient = (props) => {
	const [extraData, setExtraData] = useState();
	const rootApiUrl = useContext(UrlContext);

	useEffect(() => {
		sendRequest(null, rootApiUrl + "ingredientGroups/" + props.groupId, "GET")
			.then((response) => setExtraData((data) => ({ ...data, group: response })))
			.catch(console.error);

		sendRequest(null, rootApiUrl + "/ingredientRecipe/ingredients/" + props.id, "GET")
			.then((response) => setExtraData((data) => ({ ...data, recipes: response })))
			.catch(console.error);
	}, []);

	const backgroundImage = { backgroundImage: "url(data:image/jpg;base64," + props.image + ")" };
	return (
		<div className="individual-page">
			<div className="container" style={{ marginTop: "-50px" }}>
				<div className="main-img ingredient" style={backgroundImage}></div>
			</div>
			<div className="card-links">
				<span>Группа:</span>
				<Link to={"/ingredients?ingredientsGroupId=" + props.groupId} className="link" style={{ marginLeft: 5 }}>
					{extraData?.group?.name}
				</Link>
			</div>
			{props.description ? <ParagraphWithNewLines className="description" text={props.description} /> : null}
			{extraData?.recipes ? <h1>Найдено {extraData.recipes?.lenght} рецептов с этим ингредиентом</h1> : null}
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
			{ingredient ? (
				<>
					<Ingredient
						id={ingredient.id}
						groupId={ingredient.groupId}
						image={ingredient.image}
						description={ingredient.description}
					/>
					<RecipesCatalog ingredientId={ingredient.id} />
				</>
			) : null}
		</>
	);
};

export default IngredientPage;
