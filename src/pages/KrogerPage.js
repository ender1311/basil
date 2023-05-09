import React, { useEffect, useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import "./css/KrogerPage.css"

const clientId = process.env.REACT_APP_kroger_clientId;
const clientSecret = process.env.REACT_APP_kroger_clientSecret;
const redirectUri = 'http://localhost:3000/kroger';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

const base64Encode = (data) => {
  return btoa(unescape(encodeURIComponent(data)));
};

export function KrogerPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("cookies ice cream");
  const [tokenExpirationTime, setTokenExpirationTime] = useState(null);

  const [filters, setFilters] = useState({
    brand: "",
    fulfillment: "",
    category: "",
    price: "",
    size: ""
  });



  const getAccessToken = async (code) => {
    try {
      const response = await axios.post('https://api.kroger.com/v1/connect/oauth2/token', queryString.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64Encode(`${clientId}:${clientSecret}`)}`,
        },
      });

      console.log(response.data);

      setAccessToken(response.data.access_token);
      setTokenExpirationTime(Date.now() + response.data.expires_in * 1000);
      
      // Save the access token and expiration time in localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('tokenExpirationTime', Date.now() + response.data.expires_in * 1000);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      
      return;
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post('https://api.kroger.com/v1/connect/oauth2/token', queryString.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64Encode(`${clientId}:${clientSecret}`)}`,
        },
      });
  
      console.log(response.data);
  
      setAccessToken(response.data.access_token);
      setTokenExpirationTime(Date.now() + response.data.expires_in * 1000);
      
      // Update the access token and expiration time in localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('tokenExpirationTime', Date.now() + response.data.expires_in * 1000);
      
  
      return;
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

  
  const redirectToAuthorization = () => {
    const authUrl = `https://api.kroger.com/v1/connect/oauth2/authorize?${queryString.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'cart.basic:write profile.compact product.compact', // Updated scope AND  
    })}`;
    console.log(`authUrl: ${authUrl}`)
  
    window.location.href = authUrl;
  };
  
  useEffect(() => {
     var storedAccessToken = localStorage.getItem('accessToken');
     var storedRefreshToken = localStorage.getItem('refreshToken');
     const storedTokenExpirationTime = localStorage.getItem('tokenExpirationTime');
  
     //storedAccessToken = null;
     //storedRefreshToken = null;

    if (storedAccessToken && storedTokenExpirationTime && Date.now() < storedTokenExpirationTime) {
      setAccessToken(storedAccessToken);
      setTokenExpirationTime(storedTokenExpirationTime);
    } else if (storedRefreshToken) {
      refreshAccessToken(storedRefreshToken);
    } else {
      const code = queryString.parse(window.location.search).code;
  
      if (code) {
        console.log(`code: ${code}`);
        getAccessToken(code);
      } else {
        redirectToAuthorization();
      }
    }
  }, []);
  

  /*
  useEffect(() => {

    // Try to get the access token from localStorage
    //const storedAccessToken = localStorage.getItem('accessToken');
     const storedAccessToken = null;

    if (storedAccessToken) {
        setAccessToken(storedAccessToken);
    } else {
        const code = queryString.parse(window.location.search).code;
        

    if (code) {
      console.log(`code: ${code}`);
      getAccessToken(code);
    } else {
      redirectToAuthorization();
    }

    }
  }, []);

  */
  useEffect(() => {
    if (accessToken) {
      searchProducts(accessToken, searchTerm, filters);
    }
  }, [accessToken, searchTerm, filters]);

  const searchProducts = async (accessToken, searchTerm, filters) => {
    try {
      const response = await api.post('/api/kroger', {
        accessToken,
        searchTerm,
        filters,
      });
      console.log(response.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  const clearFilters = () => {
    setFilters({
      brand: "",
      fulfillment: "",
      category: "",
      price: "",
      size: ""
    });
  };

  const handleFilterChange = (filter, value) => {
    setFilters({ ...filters, [filter]: value });
  };

  return (
    <div className='my-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '30%' }}>
        <label>Search products: </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={clearFilters}>Clear Filters</button>
        <h3>Show Results by:</h3>
        <div>
          <label>Brand:</label>
          <select onChange={(e) => handleFilterChange("brand", e.target.value)}>
            {/* Populate with brands from API */}
          </select>
        </div>
        <div>
          <label>Fulfillment Type:</label>
          <select onChange={(e) => handleFilterChange("fulfillment", e.target.value)}>
            {/* Populate with fulfillment types from API */}
          </select>
        </div>
        <div>
          <label>Category:</label>
          <select onChange={(e) => handleFilterChange("category", e.target.value)}>
            {/* Populate with categories from API */}
          </select>
        </div>
        <div>
          <label>Price:</label>
          <select onChange={(e) => handleFilterChange("price", e.target.value)}>
            {/* Populate with prices from API */}
          </select>
        </div>
        <div>
          <label>Size:</label>
          <select onChange={(e) => handleFilterChange("size", e.target.value)}>
            {/* Populate with sizes from API */}
          </select>
        </div>
      </div>
      <div style={{ width: '70%' }} >
      <h3>Products</h3>
      <div className="products-container">
        {products.map((product) => (
            <div key={product.productId} className="product-card">
            {product.images.length > 0 && (
                <img
                src={product.images[0].sizes[0].url}
                alt={product.description}
                className="product-image"
                />
            )}
            <h3>{product.description}</h3>
            <p>Brand: {product.brand}</p>
            <button className="add-to-cart-btn">Add to cart</button>
            </div>
        ))}
        </div>
        </div>

    </div>
  );
  
}  