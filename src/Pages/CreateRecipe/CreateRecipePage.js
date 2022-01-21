import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const Select = ({ options, selected, setState, name, blankName }) => {
	const [blankSelected, setBlankSelected] = useState(true);

	const onSelectHandle = (event) => {
		if (!isNaN(event.target.value)) {
			setState(event);
			setBlankSelected(false);
		} else setBlankSelected(true);
	};

	return (
		<select onChange={onSelectHandle} name={name} style={blankSelected ? { color: "#7c7c7c" } : null}>
			<option>{blankName}</option>
			{options.map((option) => (
				<option value={option.id} key={option.id} selected={option.id === selected}>
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
			<input id="upload-photo" type="file" name="file" onChange={fileUploadedHandler} required={!selectedFile} />
			<div className="upload-img"></div>
			<span>{!selectedFile ? "Добавить фото (Загрузить)" : "Фото загружено"}</span>
			{selectedFile && supportedTypes.includes(selectedFile.type) ? (
				<>
					{selectedFile.name ? <span>Название файла: {selectedFile.name}</span> : null}
					<span>Размер: {Math.round((selectedFile.size / 1024 / 1024 + Number.EPSILON) * 100) / 100} Mb</span>
				</>
			) : selectedFile ? (
				<span>Поддерживаются фотографии только {supportedTypes.map((t) => t.split("/")[1] + " ")}форматов</span>
			) : null}
		</label>
	);
};

const IngredientSelectItem = (props) => {
	return (
		<div className="select-item container">
			<Select
				options={props.ingredientOptions}
				//selected={editing ? recipe.categoryId : null}
				setState={props.setState}
				name="ingredient-1"
				blankName="Выберите ингредиент"
			/>
			<input
				value={props.unitsValue}
				onChange={(event) =>
					props.setState((i) => {
						return { ...i, units: event.target.value };
					})
				}
				name="unit-1"
				type="text"
				placeholder="Колво"
				style={{ width: "105px" }}
			/>
			<input
				value={props.unitsTypeValue}
				onChange={(event) =>
					props.setState((i) => {
						return { ...i, unitsType: event.target.value };
					})
				}
				name="unit-type-1"
				type="text"
				placeholder="Ед. изм."
				style={{ width: "105px" }}
			/>
			{props.removeHandler ? <button className="remove-button img" data-num={props.num} onClick={props.removeHandler} /> : null}
		</div>
	);
};

const initialIngredientSelects = [{ num: 0 }, { num: 1 }];
const initialIngredientValues = [
	{ units: "", unitsType: "" },
	{ units: "", unitsType: "" },
];

const IngredientInputs = ({ value, setState }) => {
	const rootApiUrl = useContext(UrlContext);
	const [ingredientOptions, setIngredientOptions] = useState();
	const [ingredientSelects, setIngredientSelects] = useState(initialIngredientSelects);
	const [ingredientsChoosen, setIngredientsChoosen] = useState(initialIngredientValues);

	useEffect(
		() =>
			sendRequest(null, rootApiUrl + "ingredients", "GET")
				.then(setIngredientOptions)
				.catch(console.error),
		[]
	);

	const addHandler = (event) => {
		event.preventDefault();
		console.log(ingredientSelects);
		setIngredientSelects((i) => i.concat({ num: i.at(-1).num + 1 }));
	};
	const removeHandler = (event) => {
		event.preventDefault();
		setIngredientSelects((i) => i.filter((item) => item.num != event.target.dataset.num));
	};

	return ingredientOptions ? (
		<div className="ingridients-select container">
			{ingredientSelects.map((s, k) => (
				<IngredientSelectItem
					ingredientOptions={ingredientOptions}
					ingredientValue={ingredientsChoosen[k]}
					setState={setIngredientsChoosen}
					removeHandler={ingredientSelects.length > 2 ? removeHandler : null}
					num={s.num}
					key={s.num}
				/>
			))}
			{ingredientSelects.length <= 15 ? (
				<button className="add-button container" onClick={addHandler}>
					<div className="add-img"></div>
				</button>
			) : null}
		</div>
	) : null;
};

const CreateForm = ({ editing }) => {
	const navigate = useNavigate();
	const { editingRecipeId } = useParams();

	const [recipe, setRecipeValue] = useValueSaver(initialState);
	const [token] = useToken();
	const apiRootUrl = useContext(UrlContext);
	const [selectedFile, setSelectedFile] = useState();

	const [categoryOptions, setCategoryOptions] = useState();
	const [cuisineOptions, setCuisineOptions] = useState();
	const [ingredients, setIngredientValues] = useState([]);
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
	useEffect(
		async () =>
			editing
				? await sendRequest(null, apiRootUrl + "recipes/" + editingRecipeId, "GET")
						.then((response) => {
							setRecipeValue(null, {
								type: "set-all-field-values",
								value: {
									...response,
									steps: response.steps.replaceAll("\\n", "\r\n"),
									description: response.description.replaceAll("\\n", "\r\n"),
								},
							});
							setSelectedFile(
								new File([response.image], "", {
									type: "image/jpg",
								})
							);
						})
						.catch(console.error)
				: null,
		[]
	);

	const onSubmitHandle = (event) => {
		event.preventDefault();
		const reader = new FileReader();
		reader.readAsDataURL(selectedFile);
		reader.onload = async () => {
			const image = reader.result.substring(reader.result.indexOf(",") + 1);

			const requestBody = {
				name: recipe.name,
				image: image,
				cookingTime: parseInt(recipe.cookingTime),
				calories: parseInt(recipe.calories),
				proteins: parseInt(recipe.proteins),
				fats: parseInt(recipe.fats),
				carbs: parseInt(recipe.carbs),
				categoryId: parseInt(recipe.categoryId),
				cuisineId: parseInt(recipe.cuisineId),
				description: recipe.description.replaceAll(/\r\n/g, "\\n").replaceAll(/[\r\n]/g, "\\n"),
				steps: recipe.steps.replaceAll(/\r\n/g, "\\n").replaceAll(/[\r\n]/g, "\\n"),
				authorId: parseInt(token.id),
			};
			await sendRequest(
				editing ? { ...requestBody, id: editingRecipeId } : requestBody,
				apiRootUrl + "recipes/" + (editing ? editingRecipeId : ""),
				editing ? "PUT" : "POST"
			)
				.then(navigate("/recipes/" + editingRecipeId))
				.catch(console.error);
		};
		reader.onerror = console.error;
	};

	return (
		<form className="form-container" onSubmit={onSubmitHandle}>
			<div className="container">
				{editing ? <Link className="return-button img" to={"/recipes/" + recipe.id} /> : null}
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
				<input
					value={recipe.calories}
					onChange={setRecipeValue}
					name="calories"
					type="text"
					placeholder="Калории"
					maxLength="5"
				/>
				<input
					value={recipe.proteins}
					onChange={setRecipeValue}
					name="proteins"
					type="text"
					placeholder="Протеины"
					maxLength="5"
				/>
				<input value={recipe.fats} onChange={setRecipeValue} name="fats" type="text" placeholder="Жиры" maxLength="5" />
				<input value={recipe.carbs} onChange={setRecipeValue} name="carbs" type="text" placeholder="Углеводы" maxLength="5" />
			</div>
			<div className="container">
				{categoryOptions ? (
					<Select
						options={categoryOptions}
						selected={editing ? recipe.categoryId : null}
						setState={setRecipeValue}
						name="categoryId"
						blankName="Выберите категорию"
					/>
				) : null}
				{cuisineOptions ? (
					<Select
						options={cuisineOptions}
						selected={editing ? recipe.cuisineId : null}
						setState={setRecipeValue}
						name="cuisineId"
						blankName="Выберите кухню"
					/>
				) : null}
			</div>
			<FileUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
			<IngredientInputs value={ingredients} setState={setIngredientValues} />
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
			<button className="sign-up-button">{editing ? "Изменить" : "Добавить"} рецепт</button>
		</form>
	);
};

const CreateRecipePage = ({ editing }) => {
	return (
		<>
			<Header />
			<Heading>{editing ? "Изменение" : "Создание"}</Heading>
			<CreateForm editing={editing} />
		</>
	);
};

export default CreateRecipePage;
