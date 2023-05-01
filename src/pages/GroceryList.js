import { useState, useEffect } from "react";
import "./css/GroceryList.css";

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

  return (
    <div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary mr-3" onClick={() => console.log("Add to List")}>
          Add to List
        </button>
        <button className="btn btn-warning mr-3" onClick={handleRemoveSelected}>
          Remove from List
        </button>
        <button className="btn btn-danger mt-3 mb-3 mr-3" onClick={handleRemoveAll}>
          Remove All
        </button>
      </div>
      <h2>Grocery List</h2>
      <ul>
        {groceryItems.map((groceryItem, recipeIndex) => (
          <li key={recipeIndex}>
            <h3>{groceryItem.name}</h3>
            <ul>
              {groceryItem.ingredients.map((ingredient, ingredientIndex) => (
                <li key={ingredientIndex}>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedItems[recipeIndex]?.includes(ingredientIndex) || false}
                    onChange={() => handleSelectItem(recipeIndex, ingredientIndex)}
                  />
                  {ingredient}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
