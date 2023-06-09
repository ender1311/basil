const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());


app.get("/api/recipes", (req, res) => {
  const recipesFilePath = path.join(__dirname, "src", "data", "recipes.json");

  fs.readFile(recipesFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading recipes file");
      return;
    }

    const recipesData = JSON.parse(data);

    res.json(recipesData);
  });
});


app.post("/api/recipes", (req, res) => {
  const newRecipe = req.body;
  const recipesFilePath = path.join(__dirname, "src", "data", "recipes.json");

  fs.readFile(recipesFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading recipes file");
      return;
    }

    const recipesData = JSON.parse(data);

    newRecipe.id = recipesData.length + 1;
    recipesData.push(newRecipe);

    fs.writeFile(recipesFilePath, JSON.stringify(recipesData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing recipes file");
        return;
      }

      res.send("Recipe saved successfully");
    });
  });
});

// Add a new route for scraping
app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Scrape the target URL for recipe information
    // You may need to customize these selectors based on the website you're targeting
    const recipeName = document.querySelector("h1").textContent;
    const recipeDescription = document.querySelector("p.description").textContent;
    const recipeImage = document.querySelector("img.recipe-image").getAttribute("src");
    const recipeIngredients = document.querySelector("ul.ingredients").textContent;
    const recipeDirections = document.querySelector("ol.directions").textContent;

    res.json({
      name: recipeName,
      description: recipeDescription,
      image: recipeImage,
      ingredients: recipeIngredients.split('\n'),
      directions: recipeDirections.split('\n'),
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.post("/api/fetch-url", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Add a new route for saving cart items
app.post("/api/save-cart", (req, res) => {
  const cartItems = req.body;
  const cartItemsFilePath = path.join(__dirname, "src", "data", "BasilCartItems.json");

  fs.writeFile(cartItemsFilePath, JSON.stringify(cartItems, null, 2), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error writing cart items file");
      return;
    }

    res.send("Cart items saved successfully");
  });
});

// Add a new route for updating recipes
app.post("/api/recipes/update", (req, res) => {
  const updatedRecipe = req.body;
  const recipesFilePath = path.join(__dirname, "src", "data", "recipes.json");

  fs.readFile(recipesFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading recipes file");
      return;
    }

    const recipesData = JSON.parse(data);

    const recipeIndex = recipesData.findIndex((recipe) => recipe.id === updatedRecipe.id);

    if (recipeIndex !== -1) {
      recipesData[recipeIndex] = updatedRecipe;

      fs.writeFile(recipesFilePath, JSON.stringify(recipesData, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing recipes file");
          return;
        }

        res.send("Recipe updated successfully");
      });
    } else {
      res.status(404).send("Recipe not found");
    }
  });
});

// Add a new route for handling Kroger API requests

app.post("/api/kroger", async (req, res) => {
  const { accessToken, searchTerm, filters } = req.body;
  try {
    const response = await axios.get('https://api.kroger.com/v1/products', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        'filter.term': searchTerm,
        'filter.limit': 4,
        'filter.brand': filters.brand,
        'filter.category': filters.category,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
