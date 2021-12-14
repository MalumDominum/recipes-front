import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import PrivateRoute from "~/Common/PrivateRoute";

import HomePage from "~/Pages/Home/HomePage";
import RecipesCatalogPage from "~/Pages/RecipesCatalog/RecipesCatalogPage";
import RecipePage from "~/Pages/Recipe/RecipePage";
import IngredientsCatalogPage from "~/Pages/IngredientsCatalog/IngredientsCatalogPage";
import IngredientPage from "~/Pages/Ingredient/IngredientPage";
import AuthorizationCatalogPage from "~/Pages/Authorization/AuthorizationPage";
import CreateRecipePage from "~/Pages/CreateRecipe/CreateRecipePage";
import NotFoundPage from "~/Pages/NotFound/NotFoundPage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/recipes" element={<RecipesCatalogPage />} />
				<Route path="/recipes/:recipeId" element={<RecipePage />} />
				<Route path="/recipes/new" element={<PrivateRoute />}>
					<Route path="/recipes/new" element={<CreateRecipePage />} />
				</Route>
				<Route path="/ingredients" element={<IngredientsCatalogPage />} />
				<Route path="/ingredients/:ingredientId" element={<IngredientPage />} />
				<Route path="/authorization" element={<AuthorizationCatalogPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
};

export default App;
