// Filename: RecipeDetail.js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import recipesData from "../data/recipes.json";
import "./RecipeDetail.css";

export function RecipeDetail() {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

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

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe">
      <div className="ingredients">
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} style={checkedItems[index] ? { textDecoration: "line-through", color: "gray" } : {}}>
              <input
                type="checkbox"
                checked={checkedItems[index] || false}
                onChange={() => handleCheck(index)}
              />
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      <div className="directions">
        <img src={recipe.image} alt={recipe.name} />
        <h2>Directions</h2>
        <ol>
          {recipe.directions.map((direction, index) => (
            <li key={index}>{direction}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
