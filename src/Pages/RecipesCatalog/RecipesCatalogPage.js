import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UrlContext } from "~/App";
import sendRequest from "~/Common/sendRequest";
import Header from "~/Common/Header.js";
import Heading from "~/Common/Title.js";
import { RecipesFilter } from "~/Common/Filter";
import "~/index.css";
import "./Recipes.css";

const RecipeCard = (props) => {
	const [isBookmarked, setBookmark] = useState(props.isSaved);

	const bookmarkOnClickHandle = () => setBookmark((isBookmarked) => !isBookmarked);

	const backgroundImage = { backgroundImage: "url(data:image/jpg;base64," + props.image + ")" };

	return (
		<div className="card-container img" style={backgroundImage}>
			<div className="coocking-time">{props.time} минут</div>
			<div className="author">Автор: {props.author}</div>
			<div className="card-links">
				<Link to={"/recipes?categories=" + props.categoryId}>{props.category}</Link>
				<span>•</span>
				<Link to={"/recipes?cuisines=" + props.cuisineId}>{props.cuisine} кухня</Link>
			</div>
			<Link to={"/recipes/" + props.recipeId} className="card-heading">
				{props.heading}
			</Link>
			<div className="rating-container">
				<div className="stars" style={{ "--rating": props.rating }}>
					{/*[1, 2, 3, 4, 5].map((n) => (
						<button className="star" key={n}></button>
					))*/}
				</div>
				{props.rating}
			</div>
			<span className="bookmark-count">{props.bookmarkCount}</span>
			<button className={"bookmark-button img" + (isBookmarked ? " saved" : "")} onClick={bookmarkOnClickHandle}></button>
		</div>
	);
};

const RecipesCatalogPage = () => {
	const [recipes, setRecipes] = useState();
	const apiRequestUrl = useContext(UrlContext) + "recipes";

	useEffect(() => sendRequest(null, apiRequestUrl, "GET").then(setRecipes).catch(console.log), []);

	return (
		<>
			<Header />
			<Heading>Рецепты</Heading>
			<div className="page-content">
				<RecipesFilter setFiltered={setRecipes} />
				<div className="cards-container">
					{recipes?.map((r) => (
						<RecipeCard
							key={r.id}
							recipeId={r.id}
							heading={r.name}
							image={r.image}
							category="blank"
							categoryId={r.categoryId}
							cuisine="blank"
							cuisineId={r.cuisineId}
							author="blank"
							time={r.cookingTime}
							rating={4.39}
							bookmarkCount="307"
							ingredientCount="10"
							isSaved={true}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default RecipesCatalogPage;
