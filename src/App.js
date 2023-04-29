import { Route, Routes } from "react-router-dom";
// import { BrowserRouter as Router } from "react-router-dom";
import {AppNavbar} from "./components/AppNavbar";
import {Recipes} from "./pages/Recipes";
import "./App.css";

import {RecipeDetail} from "./components/RecipeDetail";
import {GroceryList} from "./pages/GroceryList";
import {KrogerPage} from "./pages/KrogerPage";
import { CreateRecipe } from "./components/CreateRecipe"; // Import the CreateRecipe component

import {AddRecipeUrl} from './components/AddRecipeUrl';
import {CopyRecipe} from './components/CopyRecipe';

export function App() {
  return (
    <div className="App">
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/add-recipe-url" element={<AddRecipeUrl />} />
        <Route path="/copy-recipe" element={<CopyRecipe />} />
        <Route path="/grocery-list" element={<GroceryList />} />
        <Route path="/kroger" element={<KrogerPage />} /> 
        
      </Routes>
    </div>
  );
}

