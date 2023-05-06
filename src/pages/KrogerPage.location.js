import React, { useEffect, useState } from 'react';
import $ from 'jquery';

export function KrogerPage() {
  const [products, setProducts] = useState([]);
  const accessToken = 'your_access_token_here';
  const locationId = process.env.kroger_locationID;
  const groceryList = ['milk', 'bread', 'eggs']; // Replace with your actual grocery list

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = [];

      for (const term of groceryList) {
        const settings = {
          async: true,
          crossDomain: true,
          url: `https://api.kroger.com/v1/products?filter.term=${term}&filter.locationId=${locationId}`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await $.ajax(settings);
        console.log(response);
        fetchedProducts.push(...response.data);
      }

      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, [accessToken, locationId, groceryList]);

  return (
    <div>
      <h1>Kroger</h1>
      <ul>
        {products.map((product) => (
          <li key={product.productId}>
            <span>{product.description}</span>
            <img src={product.images[0].sizes[0].url} alt={product.description} />
            <span>{product.size}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
