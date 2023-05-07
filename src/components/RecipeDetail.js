// Filename: RecipeDetail.js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import recipesData from "../data/recipes.json";
import "./RecipeDetail.css";
import { useNavigate } from "react-router-dom";

export function RecipeDetail() {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const navigate = useNavigate();

  
  useEffect(() => {
    function findRecipe() {
      const foundRecipe = recipesData.find((recipe) => recipe.id.toString() === id);
      setRecipe(foundRecipe);
    }

    findRecipe();
  }, [id]);

  const handleCheck = (index) => {
    setCheckedItems({ ...checkedItems, [index]: !checkedItems[index] });
  };

  const saveChanges = async () => {
    const updatedIngredients = Array.from(document.querySelector(".ingredients ul").children).map(
      (li) => li.textContent
    );
    const updatedDirections = Array.from(document.querySelector(".directions ol").children).map(
      (li) => li.textContent
    );

    const updatedRecipe = {
      ...recipe,
      ingredients: updatedIngredients,
      directions: updatedDirections,
    };

    try {
      await fetch("http://localhost:8000/api/recipes/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipe),
      });
      navigate("/"); // Redirect to home after saving changes
    } catch (err) {
      console.error("Error updating recipe:", err);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

return (
  <div className="recipe">
    <div className="ingredients">
      <div className="button-container">
        <button onClick={saveChanges}>Save</button>
      </div>
      <h2>Ingredients</h2>
      <ul contentEditable={true}>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} style={checkedItems[index] ? { textDecoration: "line-through", color: "gray" } : {}}>
            <input
              type="checkbox"
              className="checkbox-input"
              checked={checkedItems[index] || false}
              onChange={() => handleCheck(index)}
            />
            <span className="ingredient-text ms-2">{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="directions">
      <div className="button-container">
        <button onClick={saveChanges}>Save</button>
      </div>
      <img src={recipe.image} alt={recipe.name} />
      <h2>Directions</h2>
      <ol contentEditable={true}>
        {recipe.directions.map((direction, index) => (
          <li key={index}>{direction}</li>
        ))}
      </ol>
    </div>
  </div>
);


}
