import React, { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import PrivateRoute from "~/Common/PrivateRoute";

import HomePage from "~/Pages/Home/HomePage";
import RecipesCatalogPage from "~/Pages/RecipesCatalog/RecipesCatalogPage";
import RecipePage from "~/Pages/Recipe/RecipePage";
import IngredientsCatalogPage from "~/Pages/IngredientsCatalog/IngredientsCatalogPage";
import IngredientPage from "~/Pages/Ingredient/IngredientPage";
import RegistrationPage from "~/Pages/Authorization/RegistrationPage";
import LoginPage from "~/Pages/Authorization/LoginPage";
import CreateRecipePage from "~/Pages/CreateRecipe/CreateRecipePage";
import NotFoundPage from "~/Pages/NotFound/NotFoundPage";

const apiUrl = "https://localhost:7103/api/";
const UrlContext = createContext(apiUrl);

const App = () => {
	return (
		<UrlContext.Provider value={apiUrl}>
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/recipes" element={<RecipesCatalogPage />} />
					<Route path="/recipes/:recipeId" element={<RecipePage />} />
					<Route path="/recipes/author/:authorId" element={<RecipesCatalogPage filterByAuthor={true} />} />
					<Route path="/recipes/new" element={<PrivateRoute />}>
						<Route path="/recipes/new" element={<CreateRecipePage />} />
					</Route>
					<Route path="/recipes/edit/:editingRecipeId" element={<PrivateRoute />}>
						<Route path="/recipes/edit/:editingRecipeId" element={<CreateRecipePage editing={true} />} />
					</Route>
					<Route path="/recipes/saved" element={<PrivateRoute />}>
						<Route path="/recipes/saved" element={<RecipesCatalogPage filterSaved={true} />} />
					</Route>
					<Route path="/ingredients" element={<IngredientsCatalogPage />} />
					<Route path="/ingredients/:ingredientId" element={<IngredientPage />} />
					<Route path="/sign-up" element={<RegistrationPage />} />
					<Route path="/sign-in" element={<LoginPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</UrlContext.Provider>
	);
};

export default App;
export { UrlContext };
