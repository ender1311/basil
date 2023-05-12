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
         <button onClick={saveChanges} className="btn btn-success text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16">
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
            </svg>{" "}
            Save
          </button>
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
          <button onClick={saveChanges} className="btn btn-success text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16">
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
            </svg>
              {" "}
              Save
            </button>      
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
