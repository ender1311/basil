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
        const response = await axios.get("http://localhost:8000/api/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <Container fluid className="Home" style={{ minHeight: "100vh" }}>
      <Row>
        <Col style={{ boxShadow: "0px 0px 15px rgba(0,0,0,0.1)" }}>
          <Row className="recipe-row g-3 m-3" md={2} xs={1} lg={3} xl={4}>
            {recipesData.map((recipe) => (
              <Col key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Col>
            ))}

          </Row>
        </Col>
      </Row>
    </Container>
  );
}
