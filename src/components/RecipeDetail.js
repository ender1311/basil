// Filename: RecipeDetail.js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import recipesData from "../data/recipes.json";
import "./RecipeDetail.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDragDropContext } from '../context/DragDropContext';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


export function RecipeDetail() {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState({
    ingredients: [],
    directions: [],
    image: "",
    name: "",
  });
  const [checkedItems, setCheckedItems] = useState({});
  const [originalIngredients, setOriginalIngredients] = useState([]);
const [originalDirections, setOriginalDirections] = useState([]);
const { onDragEnd } = useDragDropContext();
const [isEditing, setIsEditing] = useState(false);


  const navigate = useNavigate();

    
  
  useEffect(() => {
    function findRecipe() {
      const foundRecipe = recipesData.find((recipe) => recipe.id.toString() === id);
      setRecipe(foundRecipe);
      setOriginalIngredients(foundRecipe.ingredients);
      setOriginalDirections(foundRecipe.directions);
    }
  
    findRecipe();
  }, [id]);
  

  const handleCheck = (index) => {
    setCheckedItems({ ...checkedItems, [index]: !checkedItems[index] });
  };

  const handleAddIngredient = () => {
    const newIngredients = [...recipe.ingredients, ''];
    setRecipe({ ...recipe, ingredients: newIngredients });
  };
  
  const handleAddDirection = () => {
    const newDirections = [...recipe.directions, ''];
    setRecipe({ ...recipe, directions: newDirections });
  };

  
  const saveChanges = async () => {
    if (!recipe) return;
    setIsEditing(false);
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

  const handleEditIngredients = () => {
    if (!isEditing) {
      setIsEditing(true);
      const ingredientsListItems = document.querySelectorAll(".ingredients li .ingredient-text");
      ingredientsListItems.forEach((item) => {
        item.setAttribute("contentEditable", true);
        item.classList.add("editing");
      });
    }
  };
  
  

  const handleEditDirections = () => {
    if (!isEditing) {
      setIsEditing(true);
      const directionsList = document.querySelector(".directions ol");
      directionsList.setAttribute("contentEditable", true);
      directionsList.classList.add("editing");
    }
  };
  

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRecipe({ ...recipe, ingredients: originalIngredients, directions: originalDirections });
    
    const ingredientsList = document.querySelector(".ingredients ul");
    ingredientsList.setAttribute("contentEditable", false);
    ingredientsList.classList.remove("editing");
  
    const directionsList = document.querySelector(".directions ol");
    directionsList.setAttribute("contentEditable", false);
    directionsList.classList.remove("editing");
  
    toast.info("Changes have been reverted back to the original.");
  };
  
  

  const handleDeleteIngredient = (index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };



  
  
  if (!recipe || !recipe.ingredients || !recipe.directions) {    
    return <div>Loading...</div>;
  }

  return (
<DragDropContext onDragEnd={(result) => onDragEnd(result, recipe, setRecipe)}>
    <div className="recipe">
         <ToastContainer />
      <div className="ingredients">
        <div className="button-container">
        <button onClick={handleAddIngredient} className="btn btn-primary text-white">
            Add Ingredient
            </button>

 
          <button onClick={handleEditIngredients} className="btn btn-primary text-white">
            Edit
          </button>
          <button onClick={saveChanges} className="btn btn-success text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-save"
              viewBox="0 0 16 16"
            >
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
            </svg>{" "}
            Save
          </button>
          <button onClick={handleCancelEdit} className="btn btn-secondary text-white">
          Cancel
        </button>
        </div>
        <h2>Ingredients</h2>
          <Droppable droppableId="ingredients">
            {(provided) => (
              <ul contentEditable={false} {...provided.droppableProps} ref={provided.innerRef}>
                {recipe.ingredients.map((ingredient, index) => (
                  <Draggable key={index} draggableId={`ingredient-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`ingredient-row${snapshot.isDragging ? ' dragging' : ''}`}
                    >
                        <input
                          type="checkbox"
                          className="checkbox-input custom-checkbox"
                          checked={checkedItems[index] || false}
                          onChange={() => handleCheck(index)}
                        />
                      <span className={`ingredient-text ms-2${checkedItems[index] ? ' strikethrough' : ''}`}>
                        {ingredient}
                      </span>                        
                      <button
                          onClick={() => handleDeleteIngredient(index)}
                          className="btn text-black float-end"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} style={{color: "#dc3545",}} />
                        </button>
                     </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
      </div>
  
      <div className="directions">
        <div className="button-container">
        <button onClick={handleAddDirection} className="btn btn-primary text-white">
            Add Direction
            </button>
          <button onClick={handleEditDirections} className="btn btn-primary text-white">
            Edit
          </button>
          <button onClick={saveChanges} className="btn btn-success text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-save"
              viewBox="0 0 16 16"
            >
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
          </svg>{" "}
          Save
        </button>
        <button onClick={handleCancelEdit} className="btn btn-secondary text-white">
          Cancel
        </button>
      </div>
      <img src={recipe.image} alt={recipe.name} />
      <h2>Directions</h2>
      
  <Droppable droppableId="directions">
    {(provided) => (
      <ol contentEditable={false} {...provided.droppableProps} ref={provided.innerRef}>
        {recipe.directions.map((direction, index) => (
          <Draggable key={index} draggableId={`direction-${index}`} index={index}>
          {(provided, snapshot) => (
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`direction-row${snapshot.isDragging ? ' dragging' : ''}`}
              >
              {direction}
            </li>
          )}
        </Draggable>
        ))}
        {provided.placeholder}
      </ol>
    )}
  </Droppable>
    </div>
  </div>
  </DragDropContext>
);
}
  