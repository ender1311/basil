//filename: Recipes.js
import { Container, Row, Col } from "react-bootstrap";
import { RecipeCard } from "../components/RecipeCard";
import "./css/Recipes.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import recipesData from "../data/recipes.json";
import {useNavigate} from "react-router-dom";


export function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <Container fluid className="bg-light mt-5 Home" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col xs={12} md={10} className="my-5 bg-white p-4" style={{ boxShadow: "0px 0px 15px rgba(0,0,0,0.1)" }}>
          <Row className="justify-content-center recipe-row">
            {recipesData.map((recipe) => (
              <Col key={recipe.id} xs={12} sm={6} md={4} lg={3} className="my-3">
                <RecipeCard recipe={recipe} />
              </Col>
            ))}
            <Col xs={12} sm={6} md={4} lg={3} className="my-3">
              <Link to="/create">
                <RecipeCard
                  recipe={{
                    id: "new",
                    name: "Create New Recipe",
                    description: "",
                    image: "https://via.placeholder.com/150/FFFFFF/000000?text=+",
                  }}
                  className="recipe-card-add-new"
                />
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
