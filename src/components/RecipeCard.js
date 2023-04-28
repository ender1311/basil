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
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} progressBar  />
      <Card className="recipe-card" style={{ width: "18rem" }}>
        <Card.Img className="recipe-card-img" variant="top" src={recipe.image} />
        <Card.Body className="recipe-card-body">
          <Card.Title>{recipe.name}</Card.Title>
          <Card.Text>{recipe.description}</Card.Text>
          <Button className="view-recipe-btn" as={Link} to={`/recipe/${recipe.id}`} variant="primary">
            View Recipe
          </Button>
          <Link className="add-to-list-btn" to="#" onClick={handleAddToList}>
            Add to list
          </Link>
          {addedToList && toast("Item added to grocery list")}
        </Card.Body>
      </Card>
    </div>
  );
}
