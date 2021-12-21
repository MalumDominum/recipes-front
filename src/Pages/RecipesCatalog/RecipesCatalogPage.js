import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UrlContext } from "~/App";
import sendRequest from "~/Common/sendRequest";
import Header from "~/Common/Header.js";
import Heading from "~/Common/Title.js";
import "~/index.css";
import "~/Common/Filter.css";
import "./Recipes.css";

const SectionContainer = (props) => {
	const [isCollapsed, setCollapse] = useState(false);

	const onClickHandle = function () {
		setCollapse((isCollapsed) => !isCollapsed);
	};

	return (
		<div className="section-container" style={{ maxHeight: isCollapsed ? "60px" : "600px" }}>
			<button className="collapse-button container" onClick={onClickHandle}>
				{props.heading}
				<div className="img" style={{ transform: isCollapsed ? "rotate(180deg)" : "" }}></div>
			</button>
			{props.children}
		</div>
	);
};

const SearchItem = (props) => {
	return (
		<SectionContainer heading={props.heading}>
			<input type="search" placeholder="Поиск..." />
		</SectionContainer>
	);
};

const SliderItem = (props) => {
	return (
		<SectionContainer heading={props.heading}>
			<div className="range-container">
				<input type="text" maxLength="3" />
				<span>—</span>
				<input type="text" maxLength="3" />
				<span>{props.unit}</span>
			</div>
			<div className="slider-container">
				<div className="full-range">
					<div className="range-segment" style={{ marginLeft: "40%", width: "50%" }}></div>
				</div>
				<button className="slider-range left" style={{ left: "40%" }} />
				<button className="slider-range right" style={{ left: "90%" }} />
			</div>
		</SectionContainer>
	);
};

const CheckboxFilterSection = (props) => {
	return (
		<SectionContainer heading={props.heading}>
			<input type="search" placeholder="Поиск..." />
			<div className="filter-items">{props.children}</div>
		</SectionContainer>
	);
};

const CheckboxItem = (props) => {
	return (
		<div className="checkbox-container">
			<input type="checkbox" />
			<span>{props.content}</span>
			<span className="count">({props.count})</span>
		</div>
	);
};

const Filter = (props) => {
	return (
		<div className="filter-container">
			<SearchItem heading="Название блюда" />
			<SliderItem heading="Категория" unit="Минут" minValue="5" maxValue="30" />
			<CheckboxFilterSection heading="Категория" count="37">
				{[...Array(30).keys()].map((n) => (
					<CheckboxItem content="Выпечка и десерты" count="96" />
				))}
			</CheckboxFilterSection>
			<CheckboxFilterSection heading="Категория" count="37">
				{[...Array(30).keys()].map((n) => (
					<CheckboxItem content="Выпечка и десерты" count="96" />
				))}
			</CheckboxFilterSection>
			<CheckboxFilterSection heading="Категория" count="37">
				{[...Array(30).keys()].map((n) => (
					<CheckboxItem content="Выпечка и десерты" count="96" />
				))}
			</CheckboxFilterSection>
		</div>
	);
};

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

const RecipesCatalogPage = () => {
	const [recipes, setRecipes] = useState();
	const apiRequestUrl = useContext(UrlContext) + "recipes";

	useEffect(() => sendRequest(null, apiRequestUrl, "GET").then(setRecipes).catch(console.log), []);

	return (
		<>
			<Header />
			<Heading>Рецепты</Heading>
			<div className="page-content">
				<Filter />
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
export { Filter };
