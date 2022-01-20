import { useContext, useState, useEffect, useRef } from "react";
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
			<input type="search" name={name} onChange={setState} placeholder="Поиск..." />
		</SectionContainer>
	);
};

const RangeSliderSection = ({ heading, unit, setState, leftBoundName, rightBoundName }) => {
	return (
		<SectionContainer heading={heading}>
			<div className="range-container">
				<input name={leftBoundName} onChange={setState} type="text" maxLength="3" />
				<span>—</span>
				<input name={rightBoundName} onChange={setState} type="text" maxLength="3" />
				<span>{unit}</span>
			</div>
			<div className="slider-container">
				<div className="full-range">
					<div className="range-segment" style={{ marginLeft: "0%", width: "100%" }}></div>
				</div>
				<button className="slider-range left" style={{ left: "0%" }} />
				<button className="slider-range right" style={{ left: "95%" }} />
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
			<div className="filter-items">
				{options.map((n) => (
					<CheckboxItem
						itemId={n.id}
						content={n.name}
						isHidden={n.name.toLowerCase().includes(search ? search.toLowerCase() : "")}
						count={null}
						key={n.id}
						setState={props.setState}
						name={props.name}
					/>
				))}
			</div>
		</SectionContainer>
	) : null;
};

const CheckboxItem = ({ itemId, content, count, setState, name, isHidden }) => {
	const checkHandler = (event) =>
		event.target.checked
			? setState(
					null,
					{
						type: "concat-field-value",
						name: name,
						value: itemId,
					},
					true
			  )
			: setState(
					null,
					{
						type: "remove-field-value",
						name: name,
						value: itemId,
					},
					true
			  );

	return (
		<div className={`checkbox-container${isHidden ? "" : " hidden"}`}>
			<input type="checkbox" onChange={checkHandler} />
			<span>{content}</span>
			{count ? <span className="count">({count})</span> : null}
		</div>
	);
};

const recipesInitialState = {
	name: "",
	minCookingTime: "",
	maxCookingTime: "",
	leftTimeBound: "",
	rightTimeBound: "",
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

	// prettier-ignore
	useEffect(
		() =>
			submit
				?
					sendRequest(
						null,
						apiRootUrl + "recipes?" + 
							"name=" + filter.name + "&" +
							"leftTimeBound=" + filter.leftTimeBound + "&" +
							"rightTimeBound=" + filter.rightTimeBound + "&" +
							filter.categoryIds.map((id) => `categoryId=${id}&`).join("") +
							filter.cuisineIds.map((id) => `cuisineId=${id}&`).join(""),
						"GET"
				    ).then(setFiltered)
				     .catch(console.error)
				: null,
		[submit]
	);

	return (
		<form className="filter-container" onSubmit={onSubmitHandle}>
			<button className="sign-up-button" style={{ marginTop: "15px" }}>
				Искать
			</button>
			<SearchSection setState={setFilterValue} name="name" heading="Название блюда" />
			<RangeSliderSection
				heading="Время приготовления"
				unit="Минут"
				minValue={0}
				maxValue={300}
				setState={setFilterValue}
				leftBoundName="leftTimeBound"
				rightBoundName="rightTimeBound"
			/>
			<CheckboxFilterSection
				setState={setFilterValue}
				name="categoryIds"
				requestUrl={apiRootUrl + "categories"}
				heading="Категории"
				count={null}
			/>
			<CheckboxFilterSection
				setState={setFilterValue}
				name="cuisineIds"
				requestUrl={apiRootUrl + "cuisines"}
				heading="Кухни"
				count={null}
			/>
			<CheckboxFilterSection
				setState={setFilterValue}
				name="ingredientIds"
				requestUrl={apiRootUrl + "ingredients"}
				heading="Ингредиенты"
				count={null}
			/>
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
				? sendRequest(
						null,
						`${apiRootUrl}ingredients?name=${filter.name}&${filter.groupIds.map((id) => `groupId=${id}&`).join("")}`,
						"GET"
				  )
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
			<CheckboxFilterSection
				setState={setFilterValue}
				name="groupIds"
				requestUrl={apiRootUrl + "ingredientGroups"}
				heading="Группы ингредиентов"
				count={null}
			/>
		</form>
	);
};

export { RecipesFilter, IngredientsFilter };
