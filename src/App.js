import { Route, Routes } from "react-router-dom";
// import { BrowserRouter as Router } from "react-router-dom";
import {AppNavbar} from "./components/AppNavbar";
import {Recipes} from "./pages/Recipes";
import "./App.css";

import {RecipeDetail} from "./components/RecipeDetail";
import {GroceryList} from "./pages/GroceryList";
import {KrogerPage} from "./pages/KrogerPage";
import { CreateRecipe } from "./components/CreateRecipe"; // Import the CreateRecipe component

export function App() {
  return (
    <div className="App">
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/create" element={<CreateRecipe />} />
        
        <Route path="/grocery-list" element={<GroceryList />} />
        <Route path="/kroger" element={<KrogerPage />} /> 
        
      </Routes>
    </div>
  );
}

