import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UrlContext } from "~/App";
import useToken from "~/CustomHooks/useToken";
import sendRequest from "~/Common/sendRequest";
import Header from "~/Common/Header.js";
import Heading from "~/Common/Title.js";
import { RecipesFilter } from "~/Common/Filter";
import "~/index.css";
import "./Recipes.css";

const RecipeCard = (props) => {
	const rootRequestUrl = useContext(UrlContext);
	const [token] = useToken();

	const [extraData, setExtraData] = useState({});
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(async () => {
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
			sendRequest(null, `${rootRequestUrl}bookmarks/recipes/${props.recipeId}/count`, "GET").then((response) => {
				data.bookmarksCount = response.count;
				console.log(response);
			}),
		]);
		setExtraData(data);
	}, []);

	const bookmarkOnClickHandle = () =>
		!isBookmarked
			? sendRequest(
					{
						userId: token.id,
						recipeId: props.recipeId,
					},
					rootRequestUrl + "bookmarks",
					"POST"
			  )
					.then(setIsBookmarked((isBookmarked) => !isBookmarked))
					.catch(console.error)
			: sendRequest(null, `${rootRequestUrl}bookmarks?userId=${token.id}&recipeId=${props.recipeId}`, "DELETE")
					.then(setIsBookmarked((isBookmarked) => !isBookmarked))
					.catch(console.error);

	const backgroundImage = { backgroundImage: "url(data:image/jpg;base64," + props.image + ")" };

	return (
		<div className="card-container img" style={backgroundImage}>
			<div className="coocking-time">{props.time} минут</div>
			<Link className="author" to={`/recipes/author/${props.authorId}`}>
				Автор: {extraData.author}
			</Link>
			<div className="card-links">
				<Link to={"/recipes?categories=" + props.categoryId}>{extraData.category}</Link>
				<span>•</span>
				<Link to={"/recipes?cuisines=" + props.cuisineId}>{extraData.cuisine} кухня</Link>
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
			<span className="bookmark-count">{extraData.bookmarksCount}</span>
			<button className={"bookmark-button img" + (isBookmarked ? " saved" : "")} onClick={bookmarkOnClickHandle}></button>
		</div>
	);
};

const RecipesCatalogPage = ({ filterByAuthor, filterSaved }) => {
	const [recipes, setRecipes] = useState([]);
	const [bookmarks, setBookmarks] = useState();

	const rootRequestUrl = useContext(UrlContext);
	const { authorId } = useParams();
	const [token] = useToken();

	const apiRequestUrl = filterByAuthor
		? `${rootRequestUrl}recipes?authorId=${authorId}&`
		: filterSaved
		? `${rootRequestUrl}bookmarks/users/${token.id}`
		: rootRequestUrl + "recipes?";
	const [requestUrl, setRequestUrl] = useState(apiRequestUrl);

	useEffect(() => {
		sendRequest(null, requestUrl, "GET")
			.then((response) => (!filterSaved ? setRecipes(response) : setBookmarks(response)))
			.catch(console.error);
	}, []);

	useEffect(async () => {
		if (Array.isArray(bookmarks) && bookmarks.length > 0) {
			setRecipes([]);
			let recipesTemp = [];
			await Promise.all(
				bookmarks.map((bookmark) =>
					sendRequest(null, `${rootRequestUrl}recipes/${bookmark.recipeId}`, "GET")
						.then((response) => recipesTemp.push(response))
						.catch(console.error)
				)
			);
			setRecipes(recipesTemp.sort((a, b) => a.id - b.id));
		}
	}, [bookmarks]);

	return (
		<>
			<Header />
			{filterSaved ? <Heading>Сохранённые</Heading> : <Heading>Рецепты</Heading>}
			<div className="page-content">
				{!filterSaved ? <RecipesFilter setFiltered={setRecipes} /> : null}
				<div className="cards-container">
					{Array.isArray(recipes) && recipes.length > 0
						? recipes.map((r) => (
								<RecipeCard
									key={r.id}
									recipeId={r.id}
									heading={r.name}
									image={r.image}
									categoryId={r.categoryId}
									cuisineId={r.cuisineId}
									authorId={r.authorId}
									time={r.cookingTime}
									rating={4.39}
								/>
						  ))
						: null}
				</div>
			</div>
		</>
	);
};

export default RecipesCatalogPage;
