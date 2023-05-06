import { useState, useEffect } from "react";
import "./css/GroceryList.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";

export function GroceryList() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const storedGroceryItems = JSON.parse(localStorage.getItem("groceryItems")) || [];
    setGroceryItems(storedGroceryItems);
  }, []);

  const handleRemoveSelected = () => {
    const updatedGroceryItems = groceryItems.map((groceryItem, index) => {
      const updatedIngredients = groceryItem.ingredients.filter(
        (_, i) => !selectedItems[index]?.includes(i)
      );
      return { ...groceryItem, ingredients: updatedIngredients };
    });
    localStorage.setItem("groceryItems", JSON.stringify(updatedGroceryItems));
    setGroceryItems(updatedGroceryItems);
    setSelectedItems({});
  };

  const handleRemoveAll = () => {
    localStorage.removeItem("groceryItems");
    setGroceryItems([]);
  };

  const handleSelectItem = (recipeIndex, ingredientIndex) => {
    if (selectedItems[recipeIndex]?.includes(ingredientIndex)) {
      setSelectedItems({
        ...selectedItems,
        [recipeIndex]: selectedItems[recipeIndex].filter((item) => item !== ingredientIndex),
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        [recipeIndex]: [...(selectedItems[recipeIndex] || []), ingredientIndex],
      });
    }
  };

  const handleSelectAllItems = (recipeIndex) => {
    if (selectedItems[recipeIndex]?.length === groceryItems[recipeIndex].ingredients.length) {
      setSelectedItems({
        ...selectedItems,
        [recipeIndex]: [],
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        [recipeIndex]: groceryItems[recipeIndex].ingredients.map((_, index) => index),
      });
    }
  };

  return (
    <div className="recipe-container">
      <div className="buttons-container">
        <button className="btn btn-primary mt-3 mb-3 mr-3" onClick={() => console.log("Add to List")}>
          Add to List
        </button>
        <button className="btn btn-warning mt-3 mb-3 mr-3" onClick={handleRemoveSelected}>
          Remove from List
        </button>
        <button className="btn btn-danger mt-3 mb-3 mr-3" onClick={handleRemoveAll}>
          Remove All
        </button>
      </div>
      <h2>Grocery List</h2>
      <Container>
      <Row>
        {groceryItems.map((groceryItem, recipeIndex) => (
          <Col key={recipeIndex} xs={12} md={6}>
            <div className="recipe-container">
              <h3 className="recipe-name" onClick={() => handleSelectAllItems(recipeIndex)}>
                {groceryItem.name}
              </h3>
              <ul className="ingredient-list">
                {groceryItem.ingredients.map((ingredient, ingredientIndex) => (
                  <li key={ingredientIndex}>
                    <input
                      type="checkbox"
                      className="checkbox-spacing"
                      checked={selectedItems[recipeIndex]?.includes(ingredientIndex) || false}
                      onChange={() => handleSelectItem(recipeIndex, ingredientIndex)}
                    />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  </div>
  );
}
  