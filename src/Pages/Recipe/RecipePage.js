import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UrlContext } from "~/App";
import sendRequest from "~/Common/sendRequest";
import ParagraphWithNewLines from "~/Common/ParagraphWithNewLines";
import { Link, useNavigate } from "react-router-dom";
import Header from "~/Common/Header.js";
import useToken from "~/CustomHooks/useToken";
import "~/index.css";
import "~/Common/Individual.css";

const Recipe = (props) => {
	const rootRequestUrl = useContext(UrlContext);
	const navigate = useNavigate();
	const [token] = useToken();

	const [extraData, setExtraData] = useState({});
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(async () => {
		if (token)
			sendRequest(null, `${rootRequestUrl}bookmarks/recipes/${props.recipeId}`, "GET").then((bookmarks) =>
				setIsBookmarked(bookmarks.map((b) => b.userId).includes(token.id))
			);
		let data = {};
		await Promise.all([
			sendRequest(null, `${rootRequestUrl}categories/${props.categoryId}`, "GET").then(
				(category) => (data.category = category.name)
			),
			sendRequest(null, `${rootRequestUrl}cuisines/${props.cuisineId}`, "GET").then((cuisine) => (data.cuisine = cuisine.name)),
			sendRequest(null, `${rootRequestUrl}users/${props.authorId}`, "GET").then(
				(author) => (data.author = `${author.firstName} ${author.lastName}`)
			),
			sendRequest(null, `${rootRequestUrl}bookmarks/recipes/${props.recipeId}/count`, "GET").then(
				(response) => (data.bookmarksCount = response.count)
			),
		]);
		setExtraData(data);
	}, []);

	const onBookmarkClickHandle = () =>
		token
			? !isBookmarked
				? sendRequest(
						{
							userId: token.id,
							recipeId: props.recipeId,
						},
						rootRequestUrl + "bookmarks",
						"POST"
				  )
						.then(() => {
							setIsBookmarked((isBookmarked) => !isBookmarked);
							setExtraData((data) => ({ ...data, bookmarksCount: data.bookmarksCount + 1 }));
						})
						.catch(console.error)
				: sendRequest(null, `${rootRequestUrl}bookmarks?userId=${token.id}&recipeId=${props.recipeId}`, "DELETE")
						.then(() => {
							setIsBookmarked((isBookmarked) => !isBookmarked);
							setExtraData((data) => ({ ...data, bookmarksCount: data.bookmarksCount - 1 }));
						})
						.catch(console.error)
			: navigate("/sign-up");

	const onDeleteClickHandle = () =>
		sendRequest(null, rootRequestUrl + "recipes/" + props.recipeId, "DELETE")
			.then(() => navigate("/recipes"))
			.catch(console.error);

	const backgroundImage = {
		backgroundImage: "url(data:image/jpg;base64," + props.image + ")",
		boxShadow: props.authorId == token.id ? "rgb(0 0 0 / 70%) -110px 0px 70px -25px inset" : "",
	};

	const hours = Math.floor(props.time / 60);
	const minutes = Math.round((props.time / 60 - hours) * 60);
	const formatedTime = (hours != 0 ? hours + (hours == 1 ? " час" : " часов ") : "") + (minutes != 0 ? minutes + " минут" : "");

	return (
		<div className="individual-page">
			<div className="main-img" style={backgroundImage}>
				<button className={"bookmark-button img" + (isBookmarked ? " saved" : "")} onClick={onBookmarkClickHandle} />
				{props.authorId == token.id ? (
					<>
						<Link className={"edit-button img"} to={"/recipes/edit/" + props.recipeId}></Link>
						<button className={"delete-button img"} onClick={onDeleteClickHandle}></button>
					</>
				) : null}
			</div>
			<h1 className="">{props.heading}</h1>
			<div className="card-links">
				<Link to={"/recipes?categories=" + props.categoryId}>{extraData.category}</Link>
				<span>•</span>
				<Link to={"/recipes?cuisines=" + props.cuisineId}>{extraData.cuisine} кухня</Link>
			</div>
			<div style={{ width: "100%", textAlign: "center" }}>
				<Link className="author" to={`/recipes/author/${props.authorId}`}>
					Автор: {extraData.author}
				</Link>
				<span className="bookmark-count" style={{ marginLeft: 20 }}>
					{extraData.bookmarksCount}
				</span>
			</div>
			<div className="coocking-time">Время приготовления: {formatedTime}</div>
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
			<div className="img waves-background"></div>
			{recipe ? (
				<Recipe
					recipeId={recipe.id}
					heading={recipe.name}
					image={recipe.image}
					categoryId={recipe.categoryId}
					cuisineId={recipe.cuisineId}
					authorId={recipe.authorId}
					time={recipe.cookingTime}
					rating={4.39}
					calories={recipe.calories}
					proteines={recipe.proteines}
					fats={recipe.fats}
					carbs={recipe.carbs}
					ingredientCount="10"
					description={recipe.description}
					steps={recipe.steps}
					ingredients={[
						{ id: 1, heading: "Ананас" },
						{ id: 2, heading: "Вешанки" },
					]}
				/>
			) : null}
		</>
	);
};

export default RecipePage;
