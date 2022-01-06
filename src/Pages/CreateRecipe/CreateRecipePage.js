import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
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

const Select = ({ options, setState, name }) => {
	return (
		<select onChange={setState} name={name}>
			{options.map((option) => (
				<option value={option.id} key={option.id}>
					{option.name}
				</option>
			))}
		</select>
	);
};

const FileUploader = ({ selectedFile, setSelectedFile }) => {
	const fileUploadedHandler = (event) => setSelectedFile(event.target.files[0]);

	const supportedTypes = ["image/jpeg", "image/jpg", "image/png"];

	return (
		<label className="upload-label container" htmlFor="upload-photo">
			<input id="upload-photo" type="file" name="file" onChange={fileUploadedHandler} required />
			<div className="upload-img"></div>
			<span>{!selectedFile ? "Добавить фото (Загрузить)" : "Фото загружено"}</span>
			{selectedFile && supportedTypes.includes(selectedFile.type) ? (
				<>
					<span>Название файла: {selectedFile.name}</span>
					<span>Размер: {Math.round((selectedFile.size / 1024 / 1024 + Number.EPSILON) * 100) / 100} Mb</span>
				</>
			) : selectedFile ? (
				<span>Поддерживаются фотографии только {supportedTypes.map((t) => t.split("/")[1] + " ")}форматов</span>
			) : null}
		</label>
	);
};

const IngredientInputs = () => {
	const rootApiUrl = useContext(UrlContext);
	const [ingredients, setIngredients] = useState();

	useEffect(
		() =>
			sendRequest(null, rootApiUrl + "ingredients", "GET")
				.then(setIngredients)
				.catch(console.error),
		[]
	);

	return null;
};

const CreateForm = () => {
	const navigate = useNavigate();
	const [recipe, setRecipeValue] = useValueSaver(initialState);
	const [token] = useToken();
	const apiRootUrl = useContext(UrlContext);
	const [selectedFile, setSelectedFile] = useState();

	const [categoryOptions, setCategoryOptions] = useState();
	const [cuisineOptions, setCuisineOptions] = useState();
	useEffect(
		async () =>
			await sendRequest(null, apiRootUrl + "categories", "GET")
				.then(setCategoryOptions)
				.catch(console.error),
		[]
	);
	useEffect(
		async () =>
			await sendRequest(null, apiRootUrl + "cuisines", "GET")
				.then(setCuisineOptions)
				.catch(console.error),
		[]
	);

	const onSubmitHandle = (event) => {
		event.preventDefault();
		const reader = new FileReader();
		reader.readAsDataURL(selectedFile);
		reader.onload = async () => {
			const image = reader.result.substring(reader.result.indexOf(",") + 1);

			await sendRequest(
				{
					name: recipe.name,
					image: image,
					cookingTime: parseInt(recipe.cookingTime),
					calories: parseInt(recipe.calories),
					proteins: parseInt(recipe.proteins),
					fats: parseInt(recipe.fats),
					carbs: parseInt(recipe.carbs),
					categoryId: parseInt(recipe.categoryId),
					cuisineId: parseInt(recipe.cuisineId),
					description: recipe.description,
					steps: recipe.steps,
					authorId: parseInt(token.id),
				},
				apiRootUrl + "recipes",
				"POST"
			)
				.then((response) => navigate("/recipes/" + response.id))
				.catch(console.error);
		};
		reader.onerror = console.log;
	};

	return (
		<form className="form-container" onSubmit={onSubmitHandle}>
			<div className="container">
				<input value={recipe.name} onChange={setRecipeValue} name="name" type="text" placeholder="Название рецепта" required />
				<input
					value={recipe.cookingTime}
					onChange={setRecipeValue}
					name="cookingTime"
					type="text"
					placeholder="Время приготовления"
					maxLength="3"
					required
				/>
			</div>
			<div className="params-container">
				<input value={recipe.calories} onChange={setRecipeValue} name="calories" type="text" placeholder="Калории" maxLength="5" />
				<input value={recipe.proteins} onChange={setRecipeValue} name="proteins" type="text" placeholder="Протеины" maxLength="5" />
				<input value={recipe.fats} onChange={setRecipeValue} name="fats" type="text" placeholder="Жиры" maxLength="5" />
				<input value={recipe.carbs} onChange={setRecipeValue} name="carbs" type="text" placeholder="Углеводы" maxLength="5" />
			</div>
			<div className="container">
				{categoryOptions ? <Select options={categoryOptions} setState={setRecipeValue} name="categoryId" /> : null}
				{cuisineOptions ? <Select options={cuisineOptions} setState={setRecipeValue} name="cuisineId" /> : null}
			</div>
			<FileUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
			<IngredientInputs />
			<textarea
				value={recipe.description}
				onChange={setRecipeValue}
				name="description"
				type="text"
				placeholder="Описание"
				autoComplete="on"
				className="description"
			/>
			<textarea
				value={recipe.steps}
				onChange={setRecipeValue}
				name="steps"
				type="text"
				placeholder="Пошаговая инструкция"
				autoComplete="on"
				className="description"
			/>
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
