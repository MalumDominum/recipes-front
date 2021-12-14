import React, { useState } from "react";
import Header from "~/Common/Header";
import Heading from "~/Common/Title";
import "~/index.css";
import "~/Common/Filter.css";
import "./Ingredients.css";

const RecipeCard = (props) => {
	const [isBookmarked, setBookmark] = useState(props.isSaved);

	const bookmarkOnClickHandle = function () {
		setBookmark((isBookmarked) => !isBookmarked);
	};

	let backgroundImage = { backgroundImage: "url(" + process.env.PUBLIC_URL + "/recipes/" + props.image + ")" };

	return (
		<div className="card-container img" style={backgroundImage}>
			<div className="coocking-time">{props.time} минут</div>
			<div className="author">Автор: {props.author}</div>
			<div className="card-links">
				<a href={"/categories/" + props.categoryId}>{props.category}</a>
				<span>•</span>
				<a href={"/cuisines/" + props.cuisineId}>{props.cuisine} кухня</a>
			</div>
			<a href={"/recipes/" + props.recipeId} className="card-heading">
				{props.heading}
			</a>
			{/*<button className="ingredients-button">{props.ingredientCount} Ингредиентов</button>*/}
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

const IngredientsCatalogPage = () => {
	return (
		<>
			<Header />
			<Heading>Ингредиенты</Heading>
		</>
	);
};

export default IngredientsCatalogPage;
