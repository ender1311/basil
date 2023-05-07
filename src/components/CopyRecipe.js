import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function CopyRecipe() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const navigate = useNavigate();

  // this is helper function to clean up the text
  const cleanText = (text) => {
    return text.replace(/^[*-]\s*/, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cleanedIngredients = ingredients.split("\n").map((item) => cleanText(item));
    const cleanedDirections = directions.split("\n").map((item) => cleanText(item));
  
    const newRecipe = {
      name: title,
      description: "",
      image: imageUrl,
      ingredients: cleanedIngredients,
      directions: cleanedDirections,
    };

    // Send the new recipe to the server
    try {
      const response = await axios.post("http://localhost:8000/api/recipes", newRecipe);
      console.log(response.data);

      // Display toast notification when recipe is successfully created
      toast.success("Recipe created successfully!", {
        position: toast.POSITION.TOP_RIGHT,
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
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flexGrow: 1, marginRight: "1rem" }}>
              <label htmlFor="ingredients">Ingredients:</label>
              <textarea
                id="ingredients"
                rows="10"
                style={{ width: "100%", boxSizing: "border-box", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              <label htmlFor="directions">Directions:</label>
              <textarea
                id="directions"
                rows="10"
                style={{ width: "100%", boxSizing: "border-box", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }}
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" style={{ backgroundColor: "green", color: "white" }}>
            Create Recipe
          </button>
        </form>
      </div>
    </>
  );
}
