import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UrlContext } from "~/App";
import useValueSaver from "~/CustomHooks/useValueSaver";
import useToken from "~/CustomHooks/useToken";
import sendRequest from "~/Common/sendRequest";
import Header from "~/Common/Header";
import Heading from "~/Common/Title";
import "~/index.css";
import "./CreateRecipe.css";

const initialState = {
	name: "",
	cookingTime: "",
	calories: "",
	proteins: "",
	fats: "",
	carbs: "",
	description: "",
	steps: "",
};

const Select = (props) => {
	const [options, setOptions] = useState();

	useEffect(async () => await sendRequest(null, props.apiRequestUrl, "GET").then(setOptions).catch(console.log), []);

	const adding = props.adding ? props.adding : "";

	return options ? (
		<select value={props.value} onChange={props.onChange} name={props.name}>
			{options.map((option) => (
				<option value={option.id} key={option.id}>
					{option.name + adding}
				</option>
			))}
		</select>
	) : null;
};

const CreateForm = () => {
	const navigate = useNavigate();
	const [recipe, setRecipeValue] = useValueSaver(initialState);
	const [token, setToken] = useToken();
	const apiRootUrl = useContext(UrlContext);
	const ref = useRef();

	const onSubmitHandle = async (event) => {
		event.preventDefault();

		console.log(recipe);
		console.log(ref);
		/*
		await sendRequest(
			{
				name: recipe.name,
				cookingTime: recipe.cookingTime,
				calories: recipe.calories,
				proteins: recipe.proteins,
				fats: recipe.fats,
				carbs: recipe.carbs,
				categoryId: recipe.categoryId,
				cuisineId: recipe.cuisineId,
				description: recipe.description,
				steps: recipe.steps,
				authorId: token.id,
			},
			apiRootUrl + "recipes/new",
			"POST"
		)
			.then((response) => {
				setToken(response);
				navigate("/recipes/" + response.id);
			})
			.catch(console.log);*/
	};

	return (
		<form className="form-container" onSubmit={onSubmitHandle}>
			<div className="container">
				<input value={recipe.name} onChange={setRecipeValue} name="name" type="text" placeholder="Название рецепта" required />
				<input value={recipe.cookingTime} onChange={setRecipeValue} name="cookingTime" type="text" placeholder="Время приготовления" maxlength="3" required />
			</div>
			<div className="params-container">
				<input value={recipe.calories} onChange={setRecipeValue} name="calories" type="text" placeholder="Калории" maxlength="5" />
				<input value={recipe.proteins} onChange={setRecipeValue} name="proteins" type="text" placeholder="Протеины" maxlength="5" />
				<input value={recipe.fats} onChange={setRecipeValue} name="fats" type="text" placeholder="Жиры" maxlength="5" />
				<input value={recipe.carbs} onChange={setRecipeValue} name="carbs" type="text" placeholder="Углеводы" maxlength="5" />
			</div>
			<div className="container">
				<Select apiRequestUrl={apiRootUrl + "categories"} value={recipe.categoryId} onChange={setRecipeValue} name="category" />
				<Select apiRequestUrl={apiRootUrl + "cuisines"} adding=" кухня" value={recipe.cuisineId} onChange={setRecipeValue} name="cuisine" />
			</div>

			<textarea value={recipe.description} onChange={setRecipeValue} name="description" type="text" placeholder="Описание" autoComplete="on" className="description" />
			<textarea value={recipe.steps} onChange={setRecipeValue} name="steps" type="text" placeholder="Пошаговая инструкция" autoComplete="on" className="description" />
			<button className="sign-up-button">Добавить рецепт</button>
		</form>
	);
};

const CreateRecipePage = () => {
	return (
		<>
			<Header />
			<Heading>Создание</Heading>
			<CreateForm />
		</>
	);
};

export default CreateRecipePage;
