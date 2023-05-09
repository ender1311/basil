import { useState, useEffect } from "react";
import axios from "axios";
import { useKrogerContext } from "../context/KrogerContext";
import "./css/BasilCart.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddToKrogerCart } from '../components/AddToKrogerCart';


export function BasilCart() {
  const [cartItems, setCartItems] = useState([]);
  const { accessToken, groceryItems } = useKrogerContext(); // Add groceryItems here
  const [loading, setLoading] = useState(true); // Add loading state here

  useEffect(() => {
    if (accessToken && groceryItems.length > 0) {
      const fetchKrogerProducts = async () => {
        const fetchedItems = [];

        // console log groceryItems
        console.log("Grocery items:", groceryItems[0].ingredients)

        // Loop through each groceryItem
        for (const groceryItem of groceryItems) {
          // Loop through each ingredient of the groceryItem
          for (const ingredient of groceryItem.ingredients) {
            // Remove number and measurement size from the ingredient
            //const cleanedIngredient = ingredient.replace(/^\d+\s*(\w+)?\s*/, '');
            // Remove number, measurement size, and parentheses from the ingredient
           // const cleanedIngredient = ingredient.replace(/^\d+\s*(\w+)?\s*/, '').replace(/ *\([^)]*\) */g, '').replace(/ *\[[^\]]*\] */g, '').replace(/fresh|\-|\d+\s*\w+\s*\d+\s*\w+|\d+/g, '').trim();
                // Remove words like "cup" and characters before it, "piece", and "ounces"
            //const cleanedIngredient2 = cleanedIngredient.replace(/^.*cup\s*/, '').replace(/piece\s*/g, '').replace(/ounces\s*/g, '');
    
            const cleanedIngredient = ingredient.replace(/(\([^)]*\)\s*)|(\[[^\]]*\]\s*)|fresh|(-\s*)|cups?\s*|piece\s*|ounces\s*|(\d+\s*)|\d\/\d+\s*|tablespoon\s*/g, '').replace(/^[/-]\s*/, '').trim();            
            
            
            console.log("Cleaned ingredient:", cleanedIngredient);
            
            try {
              const response = await axios.get(
                "https://api.kroger.com/v1/products",
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  params: {
                    'filter.term': cleanedIngredient,
                    'filter.limit': 1,
                  },
                }
              );

              fetchedItems.push(...response.data.data);
            } catch (error) {
              console.error("Error fetching Kroger data:", error);
            }
          }
        }

        setCartItems(fetchedItems);
        setLoading(false); // Set loading to false

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

      const handleAddAll = async () => {
        try {
          // Convert cartItems to the format expected by the Kroger API
          const itemsForKroger = cartItems.map(item => {
            if (!item.upc) {
              toast.error(`Error: UPC not found for item: ${item.description}`);
              return null;
            }
      
            return {
              upc: item.upc,
              quantity: 1, // You can replace this with the actual quantity from the cart item
            };
          }).filter(item => item !== null);
      
          console.log('Items for Kroger:', itemsForKroger)
          // Check if there are items with valid UPC and quantity before proceeding
          if (itemsForKroger.length === 0) {
            toast.error('No items with valid UPC and quantity found.');
            return;
          }
    
          console.log('Access token:', accessToken)

          // Call the AddToKrogerCart function and wait for the response
          await AddToKrogerCart(itemsForKroger, accessToken);
      
          // Show a success message if the items were added successfully
          toast.success('All items added to Kroger cart');
        } catch (error) {
          // Show an error message if there was a problem
          toast.error(`Error adding items to Kroger cart: ${error.message}`);
        }
      };
      
      
      const handleRemoveAll = () => {
        // Add your logic for removing all items from Kroger cart
        toast.error('All items removed from Kroger cart');
      };
      
      return (
        <div className="basil-cart-container">
        <ToastContainer />
        <div className="header">
          <h2 className="title">Basil Cart</h2>
          <div className="buttons">
            <Button variant="primary" onClick={handleAddAll}>
              Add all to Kroger Cart
            </Button>
            <Button variant="danger" onClick={handleRemoveAll} className="ml-2">
              Remove all from Kroger Cart
            </Button>
          </div>
        </div>
        <Container>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center vh-80">
                <p className="ml-2 text-center loading-message">Loading...</p>
                <Spinner animation="border" role="status" variant="primary" />
              </div>
            ) : (
              <Row>
                {cartItems.map((item, index) => (
                  <Col key={index} xs={12} md={6} lg={3}>
                    <div className="basil-cart-item">
                      <img
                        src={findImageURL(item.images, "front", "large")}
                        alt={item.description}
                        className="product-image"
                      />
                      <p className="item-description">
                        {item.description.length > 50
                          ? item.description.substring(0, 50) + "..."
                          : item.description.trim()}
                      </p>
                      <div className="item-actions">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          defaultValue="1"
                          className="quantity-input"
                        />
                        <Button variant="primary" className="ml-2 add-to-cart-button">
                          Add
                        </Button>
                        </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </div>
      );
         
}
