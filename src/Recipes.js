import React, { useState } from "react";
import "./index.css";
import "./Recipes.css";
import "./Filter.css";

const Heading = (props) => {
	return (
		<div className="heading-container">
			<div className="img waves-background"></div>
			<h1 id="main-heading" data-text={props.children}>
				{props.children}
			</h1>
		</div>
	);
};

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

const Recipes = () => {
	return (
		<>
			<Heading>Рецепты</Heading>
			<div className="page-content">
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
				<div className="cards-container">
					<RecipeCard
						heading="Сашими из свеклы с салатом корн и медово-горчичной заправкой"
						image="sashimi.jpg"
						recipeId="1"
						category="Салаты"
						categoryId="1"
						cuisine="Японская"
						cuisineId="1"
						author="Алексей Зимин"
						time="10"
						rating={4.89}
						bookmarkCount="307"
						ingredientCount="10"
						isSaved={true}
					/>
					{[...Array(30).keys()].map((n) => (
						<RecipeCard
							heading="Манная каша а-ля паннакотта"
							image="semolina.jpg"
							recipeId="1"
							category="Выпечка и десерты"
							categoryId="1"
							cuisine="Японская"
							cuisineId="1"
							author="Алексей Зимин"
							time="10"
							rating={4.32}
							bookmarkCount="307"
							ingredientCount="11"
							isSaved={false}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default Recipes;
