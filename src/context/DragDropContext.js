import React, { createContext, useContext, useCallback } from 'react';

const DragDropContext = createContext();

export function useDragDropContext() {
  return useContext(DragDropContext);
}

export function DragDropProvider({ children }) {
  
  const handleIngredientDragEnd = useCallback((result, recipe, setRecipe) => {
    if (!result.destination) {
      return;
    }
  
    const reorderedIngredients = Array.from(recipe.ingredients);
    const [removed] = reorderedIngredients.splice(result.source.index, 1);
    reorderedIngredients.splice(result.destination.index, 0, removed);
  
    setRecipe({ ...recipe, ingredients: reorderedIngredients });
  }, []);
  
  const handleDirectionDragEnd = useCallback((result, recipe, setRecipe) => {
    if (!result.destination) {
      return;
    }
  
    const reorderedDirections = Array.from(recipe.directions);
    const [removed] = reorderedDirections.splice(result.source.index, 1);
    reorderedDirections.splice(result.destination.index, 0, removed);
  
    setRecipe({ ...recipe, directions: reorderedDirections });
  }, []);

  const onDragEnd = useCallback((result, recipe, setRecipe) => {
    const { source } = result;

    if (source.droppableId === 'ingredients') {
      handleIngredientDragEnd(result, recipe, setRecipe);
    } else if (source.droppableId === 'directions') {
      handleDirectionDragEnd(result, recipe, setRecipe);
    }
  }, [handleIngredientDragEnd, handleDirectionDragEnd]);
  
  return (
    <DragDropContext.Provider value={{ onDragEnd }}>
      {children}
    </DragDropContext.Provider>
  );
}
