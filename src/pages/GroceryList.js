import { useState, useEffect } from "react";
import "./css/GroceryList.css";

export function GroceryList() {
  const [groceryItems, setGroceryItems] = useState([]);

  useEffect(() => {
    const storedGroceryItems = JSON.parse(localStorage.getItem("groceryItems")) || [];
    setGroceryItems(storedGroceryItems);
  }, []);

  const handleRemoveAll = () => {
    localStorage.removeItem("groceryItems");
    setGroceryItems([]);
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-danger mt-3 mb-3 mr-3"
          onClick={handleRemoveAll}
        >
          Remove All
        </button>
      </div>
      <h2>Grocery List</h2>
      <ul>
        {groceryItems.map((groceryItem, index) => (
          <li key={index}>
            <h3>{groceryItem.name}</h3>
            <ul>
              {groceryItem.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
