/*
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { load } from "cheerio";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Import the ScraperFactory
import ScraperFactory from "../scraper/helpers/ScraperFactory";

export function AddRecipeUrl() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [directions, setDirections] = useState([]);
  const navigate = useNavigate();

  // Initialize the ScraperFactory
  const scraperFactory = new ScraperFactory();

  const fetchRecipeData = async (url) => {
    try {
      // Get the appropriate scraper for the given URL
      const scraper = scraperFactory.getScraper(url);
      
      // Scrape the target URL for recipe information
      const recipeData = await scraper.fetchRecipe();

      setName(recipeData.name);
      setDescription(recipeData.description);
      setImage(recipeData.image);
      setIngredients(recipeData.ingredients);
      setDirections(recipeData.instructions);
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

*/