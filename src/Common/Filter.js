import { useContext, useState, useEffect } from "react";
import useValueSaver from "~/CustomHooks/useValueSaver";
import sendRequest from "./sendRequest";
import { UrlContext } from "~/App";
import "~/index.css";
import "./Filter.css";

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

const SearchSection = ({ heading, setState, name }) => {
	return (
		<SectionContainer heading={heading}>
			<input type="search" onChange={setState} name={name} placeholder="Поиск..." />
		</SectionContainer>
	);
};

const SliderSection = (props) => {
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
	const [options, setOptions] = useState();
	const [search, setSearch] = useState();

	useEffect(async () => await sendRequest(null, props.requestUrl, "GET").then(setOptions).catch(console.log), []);

	return options ? (
		<SectionContainer heading={props.heading}>
			<input type="search" onChange={(event) => setSearch(event.target.value)} placeholder="Поиск..." />
			<div className="filter-items">{options.map((n) => (n.name.toLowerCase().includes(search ? search.toLowerCase() : "") ? <CheckboxItem content={n.name} count={null} key={n.id} /> : null))}</div>
		</SectionContainer>
	) : null;
};

const CheckboxItem = ({ content, count }) => {
	return (
		<div className="checkbox-container">
			<input type="checkbox" />
			<span>{content}</span>
			{count ? <span className="count">({count})</span> : null}
		</div>
	);
};

const recipesInitialState = {
	name: "",
	minCookingTime: "",
	maxCookingTime: "",
	categoryIds: [],
	cuisineIds: [],
	ingredientIds: [],
};

const RecipesFilter = ({ setFiltered }) => {
	const apiRootUrl = useContext(UrlContext);
	const [submit, setSubmit] = useState();
	const [filter, setFilterValue] = useValueSaver(recipesInitialState);

	const onSubmitHandle = (event) => {
		event.preventDefault();
		setSubmit(filter);
	};

	useEffect(
		() =>
			submit
				? sendRequest(null, apiRootUrl + "recipes/" + filter.name, "GET")
						.then(setFiltered)
						.catch(console.log)
				: null,
		[submit]
	);

	return (
		<form className="filter-container" onSubmit={onSubmitHandle}>
			<button className="sign-up-button" style={{ marginTop: "15px" }}>
				Искать
			</button>
			<SearchSection setState={setFilterValue} name="name" heading="Название блюда" />
			<SliderSection heading="Время приготовления" unit="Минут" minValue="5" maxValue="30" />
			<CheckboxFilterSection setState={setFilterValue} name="categoryIds" requestUrl={apiRootUrl + "categories"} heading="Категории" count={null} />
			<CheckboxFilterSection setState={setFilterValue} name="cuisineIds" requestUrl={apiRootUrl + "cuisines"} heading="Кухни" count={null} />
			<CheckboxFilterSection setState={setFilterValue} name="ingredientIds" requestUrl={apiRootUrl + "ingredients"} heading="Ингредиенты" count={null} />
		</form>
	);
};

const ingredientsInitialState = {
	name: "",
	groupIds: [],
};

const IngredientsFilter = ({ setFiltered }) => {
	const apiRootUrl = useContext(UrlContext);
	const [submit, setSubmit] = useState();
	const [filter, setFilterValue] = useValueSaver(ingredientsInitialState);

	const onSubmitHandle = (event) => {
		event.preventDefault();
		setSubmit(filter);
	};

	useEffect(
		() =>
			submit
				? sendRequest(null, apiRootUrl + "ingredients/" + filter.name, "GET")
						.then(setFiltered)
						.catch(console.log)
				: null,
		[submit]
	);

	return (
		<form className="filter-container" onSubmit={onSubmitHandle}>
			<button className="sign-up-button" style={{ marginTop: "15px" }}>
				Искать
			</button>
			<SearchSection setState={setFilterValue} name="name" heading="Название ингредиента" />
			<CheckboxFilterSection setState={setFilterValue} name="groupIds" requestUrl={apiRootUrl + "ingredientGroups"} heading="Группы ингредиентов" count={null} />
		</form>
	);
};

export { RecipesFilter, IngredientsFilter };
