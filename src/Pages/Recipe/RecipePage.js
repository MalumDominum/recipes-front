import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UrlContext } from "~/App";
import sendRequest from "~/Common/sendRequest";
import ParagraphWithNewLines from "~/Common/ParagraphWithNewLines";
import { Link } from "react-router-dom";
import Header from "~/Common/Header.js";
import "~/index.css";
import "./Recipe.css";

const Recipe = (props) => {
	const [isBookmarked, setBookmark] = useState(props.isSaved);

	const bookmarkOnClickHandle = () => setBookmark((isBookmarked) => !isBookmarked);

	const backgroundImage = { backgroundImage: "url(data:image/jpg;base64," + props.image + ")" };
	return (
		<div className="ingredient-container">
			<div className="img" style={backgroundImage}></div>
			<h1 className="">{props.heading}</h1>
			<div className="card-links">
				<Link to={"/recipes?categories=" + props.categoryId}>{props.category}</Link>
				<span>•</span>
				<Link to={"/recipes?cuisines=" + props.cuisineId}>{props.cuisine} кухня</Link>
			</div>
			<div className="author">Автор: {props.author}</div>
			<div className="coocking-time">{props.time} минут</div>
			<span className="bookmark-count">{props.bookmarkCount}</span>
			<button className={"bookmark-button img" + (isBookmarked ? " saved" : "")} onClick={bookmarkOnClickHandle}></button>
			<div className="rating-container">
				<div className="stars" style={{ "--rating": props.rating }}>
					{/*[1, 2, 3, 4, 5].map((n) => (
						<button className="star" key={n}></button>
					))*/}
				</div>
				{props.rating}
			</div>
			{props.description ? <ParagraphWithNewLines className="description" text={props.description} /> : null}
			<div className="ingredients-count">{props.ingredientCount} Ингредиентов</div>
			<ul className="ingredients-list">
				{props.ingredients.map((i) => (
					<li className="ingredient-item" key={i.id}>
						<Link to={"/ingredients/" + i.id}>{i.heading}</Link>
					</li>
				))}
			</ul>
			<ParagraphWithNewLines className="description" text={props.steps} />
		</div>
	);
};

const RecipePage = () => {
	const { recipeId } = useParams();
	const [recipe, setRecipe] = useState();
	const apiRequestUrl = useContext(UrlContext) + "recipes/" + recipeId;

	useEffect(() => sendRequest(null, apiRequestUrl, "GET").then(setRecipe).catch(console.error), []);

	return (
		<>
			<Header />
			{recipe ? (
				<Recipe
					recipeId={recipe.id}
					heading={recipe.name}
					image={recipe.image}
					category="blank"
					categoryId={recipe.categoryId}
					cuisine="blank"
					cuisineId={recipe.cuisineId}
					author="blank"
					time={recipe.cookingTime}
					rating={4.39}
					calories={recipe.calories}
					proteines={recipe.proteines}
					fats={recipe.fats}
					carbs={recipe.carbs}
					bookmarkCount="307"
					ingredientCount="10"
					description={recipe.description}
					steps={recipe.steps}
					ingredients={[
						{ id: 1, heading: "Ананас" },
						{ id: 2, heading: "Вешанки" },
					]}
					isSaved={true}
				/>
			) : null}
		</>
	);
};

export default RecipePage;
