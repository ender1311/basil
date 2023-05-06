// Filename: pages/CreateRecipe.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { load } from "cheerio";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function CreateRecipe() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [directions, setDirections] = useState([]);
  const navigate = useNavigate();

  const fetchRecipeData = async (url) => {
    try {
      const response = await axios.post("http://localhost:8000/api/fetch-url", { url });

      const $ = load(response.data);

      // Scrape the target URL for recipe information
      // You may need to customize these selectors based on the website you're targeting
      const recipeName = $("h1").text();
      const recipeDescription = $("p.description").text();
      const recipeImage = $("img.recipe-image").attr("src");
      const recipeIngredients = $("ul.ingredients").text();
      const recipeDirections = $("ol.directions").text();

      setName(recipeName);
      setDescription(recipeDescription);
      setImage(recipeImage);
      setIngredients(recipeIngredients.split('\n'));
      setDirections(recipeDirections.split('\n'));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      name,
      description,
      image,
      ingredients,
      directions,
    };

    // Send the new recipe to the server
    try {
      const response = await axios.post("http://localhost:8000/api/recipes", newRecipe);
      console.log(response.data);

          // Display toast notification when recipe is successfully created
      toast.success('Recipe created successfully!', {
      position: toast.POSITION.TOP_RIGHT
    });

      navigate("/");
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <>
      <div className="create-recipe">
        <h2>Create New Recipe</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="url">Recipe URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => fetchRecipeData(url)}
          />
          <button type="submit" style={{ backgroundColor: "green", color: "white" }}>
            Create Recipe
          </button>
        </form>
      </div>
    </>
  );
}
