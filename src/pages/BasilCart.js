import { useState, useEffect } from "react";
import axios from "axios";
import { useKrogerContext } from "../context/KrogerContext";
import "./css/BasilCart.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

export function BasilCart() {
  const [cartItems, setCartItems] = useState([]);
  const { accessToken, groceryItems } = useKrogerContext(); // Add groceryItems here

  useEffect(() => {
    if (accessToken && groceryItems.length > 0) {
      const fetchKrogerProducts = async () => {
        const fetchedItems = [];

        for (const groceryItem of groceryItems) {
          try {
            const response = await axios.get(
              "https://api.kroger.com/v1/products",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                params: {
                  'filter.term': groceryItem.name,
                  'filter.limit': 10,
                },
              }
            );

            fetchedItems.push(...response.data.data);
          } catch (error) {
            console.error("Error fetching Kroger data:", error);
          }
        }

        setCartItems(fetchedItems);
        console.log("Fetched items:", fetchedItems);
        // Save cart items to the server
        try {
          await axios.post("http://localhost:8000/api/save-cart", fetchedItems);
          console.log("Cart items saved successfully");
        } catch (error) {
          console.error("Error saving cart items:", error);
        }
      };

      fetchKrogerProducts();
    }
  }, [accessToken, groceryItems]);

    // Helper function to find the correct image URL
    const findImageURL = (images, perspective, size) => {
        const image = images.find((img) => img.perspective === perspective);
        if (image) {
          const imageSize = image.sizes.find((s) => s.size === size);
          if (imageSize) {
            return imageSize.url;
          }
        }
        return "";
      };

   return (
    <div className="basil-cart-container">
      <h2>Basil Cart</h2>
      <Container>
        <Row>
          {cartItems.map((item, index) => (
            <Col key={index} xs={12} md={6} lg={3} >
              <div className="basil-cart-item">
                <img
                  src={findImageURL(item.images, "front", "large")}
                  alt={item.description}
                  className="product-image"
                />
                <h4>{item.description}</h4>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
