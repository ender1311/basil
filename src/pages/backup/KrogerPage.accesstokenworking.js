import React, { useEffect, useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';

const clientId = process.env.REACT_APP_kroger_clientId;
const clientSecret = process.env.REACT_APP_kroger_clientSecret;
const redirectUri = 'http://localhost:3000/kroger'; // Make sure to replace this with your own redirect URI

const base64Encode = (data) => {
  return btoa(unescape(encodeURIComponent(data)));
};

// const base64Encode = (data) => {
//   return Buffer.from(data, 'binary').toString('base64');
// };

export function KrogerPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [products, setProducts] = useState([]);



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
        return;
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    };
    

      
    function redirectToAuthorization() {
      const authUrl = `https://api.kroger.com/v1/connect/oauth2/authorize?${queryString.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'product.compact', 
      })}`;
      console.log(`authUrl: ${authUrl}`)
     
      window.location.href = authUrl;
    }

    useEffect(() => {
      const code = queryString.parse(window.location.search).code;
  
      
  
      if (code) {
        console.log(`code: ${code}`);
        getAccessToken(code);
      } else {
        redirectToAuthorization();
      }  
  }, []);

  useEffect(() => {
    if (accessToken) {

      searchProducts(accessToken);
    }

    async function searchProducts(accessToken) {
      try {
        const response = await axios.get('https://api.kroger.com/v1/products', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          params: {
            'filter.term': 'tofu',
            'filter.limit': 2,
          },
        });

        console.log(response.data);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  }, [accessToken]);

  return (
    <div>
      {accessToken ? <p>Access token: {accessToken}</p> : <p>Loading...</p>}
      {products.map((product) => (
        <div key={product.productId}>
          <h3>{product.description}</h3>
          <p>Brand: {product.brand}</p>
        </div>
      ))}
    </div>
  );


}
