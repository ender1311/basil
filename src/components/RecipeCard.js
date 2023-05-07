import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./RecipeCard.css";

export function RecipeCard({ recipe }) {
  const [addedToList, setAddedToList] = useState(false);

  const handleAddToList = () => {
    const groceryItems = JSON.parse(localStorage.getItem("groceryItems")) || [];
    const newGroceryItem = {
      name: recipe.name,
      ingredients: recipe.ingredients,
    };
    localStorage.setItem("groceryItems", JSON.stringify([...groceryItems, newGroceryItem]));
    setAddedToList(true);
    toast.success("Recipe added to grocery list", {
      theme: "colored",
      icon: "🚀",
    });
  };

  return (
    <div>
      <ToastContainer
        position= "top-left"
        autoClose={1400}
        hideProgressBar={false}
        progressBar
      />
      <Card className="recipe-card" style={{ width: "18rem" }}>
        <Card.Img className="recipe-card-img" variant="top" src={recipe.image} />
        <Card.Body className="recipe-card-body">
          <Card.Title>{recipe.name}</Card.Title>

          {/* <Card.Text>{recipe.description}</Card.Text> */}
          
          <div className="d-flex button_container">
            <Button className="view-recipe-btn" as={Link} to={`/recipe/${recipe.id}`} variant="primary">
              View Recipe
            </Button>
            <Button className="add-to-list-btn" to="#" onClick={handleAddToList} variant="success">
              Add to list
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
